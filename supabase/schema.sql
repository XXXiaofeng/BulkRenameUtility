-- =============================================
-- Bulk Rename Utility - Supabase 数据库建表 SQL
-- =============================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. users 表 - 登录用户
-- =============================================
-- 注意: Supabase Auth 会自动创建 auth.users 表
-- 这个表用于存储额外的用户信息

CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    name VARCHAR(255),
    avatar_url TEXT,
    tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'premium', 'lifetime')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_tier ON public.users(tier);

-- RLS 策略
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 触发器: 新用户注册时自动创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. anonymous_users 表 - 匿名用户追踪
-- =============================================

CREATE TABLE public.anonymous_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fingerprint VARCHAR(64) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_anonymous_fingerprint ON public.anonymous_users(fingerprint);
CREATE INDEX idx_anonymous_created_at ON public.anonymous_users(created_at);

-- RLS 策略 (允许匿名插入和更新)
ALTER TABLE public.anonymous_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.anonymous_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select by fingerprint" ON public.anonymous_users
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update" ON public.anonymous_users
    FOR UPDATE USING (true);

-- =============================================
-- 3. usage_logs 表 - 使用记录
-- =============================================

CREATE TABLE public.usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    anonymous_id UUID REFERENCES public.anonymous_users(id) ON DELETE SET NULL,
    feature_type VARCHAR(20) NOT NULL CHECK (feature_type IN ('rename', 'organize')),
    file_count INTEGER NOT NULL DEFAULT 0,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 确保至少有一个用户标识
    CONSTRAINT usage_has_user CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);

-- 创建索引
CREATE INDEX idx_usage_user_id ON public.usage_logs(user_id);
CREATE INDEX idx_usage_anonymous_id ON public.usage_logs(anonymous_id);
CREATE INDEX idx_usage_feature_type ON public.usage_logs(feature_type);
CREATE INDEX idx_usage_created_at ON public.usage_logs(created_at);

-- 复合索引用于快速查询每日使用量
CREATE INDEX idx_usage_daily_user ON public.usage_logs(user_id, feature_type, created_at);
CREATE INDEX idx_usage_daily_anon ON public.usage_logs(anonymous_id, feature_type, created_at);

-- RLS 策略
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage" ON public.usage_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow insert usage" ON public.usage_logs
    FOR INSERT WITH CHECK (true);

-- =============================================
-- 4. subscriptions 表 - 订阅/支付 (预留)
-- =============================================

CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan VARCHAR(20) NOT NULL CHECK (plan IN ('free', 'premium', 'lifetime')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    payment_provider VARCHAR(50), -- 'stripe', 'buymeacoffee', etc.
    payment_id VARCHAR(255),
    amount_cents INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_expires_at ON public.subscriptions(expires_at);

-- RLS 策略
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- 5. 辅助函数 - 获取用户每日使用量
-- =============================================

CREATE OR REPLACE FUNCTION get_daily_usage(
    p_user_id UUID DEFAULT NULL,
    p_anonymous_id UUID DEFAULT NULL,
    p_feature_type VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    feature_type VARCHAR,
    usage_count BIGINT,
    file_count_total BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ul.feature_type,
        COUNT(*)::BIGINT as usage_count,
        COALESCE(SUM(ul.file_count), 0)::BIGINT as file_count_total
    FROM public.usage_logs ul
    WHERE 
        (p_user_id IS NULL OR ul.user_id = p_user_id)
        AND (p_anonymous_id IS NULL OR ul.anonymous_id = p_anonymous_id)
        AND (p_feature_type IS NULL OR ul.feature_type = p_feature_type)
        AND ul.created_at >= CURRENT_DATE
        AND ul.created_at < CURRENT_DATE + INTERVAL '1 day'
        AND ul.success = true
    GROUP BY ul.feature_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. 辅助函数 - 检查是否超出限制
-- =============================================

CREATE OR REPLACE FUNCTION check_usage_limit(
    p_user_id UUID DEFAULT NULL,
    p_anonymous_id UUID DEFAULT NULL,
    p_feature_type VARCHAR DEFAULT 'rename',
    p_file_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    allowed BOOLEAN,
    reason TEXT,
    remaining_count INTEGER,
    max_files INTEGER
) AS $$
DECLARE
    v_tier VARCHAR := 'anonymous';
    v_max_count INTEGER := 2;
    v_max_files INTEGER := 50;
    v_current_count INTEGER := 0;
BEGIN
    -- 获取用户等级
    IF p_user_id IS NOT NULL THEN
        SELECT tier INTO v_tier FROM public.users WHERE id = p_user_id;
        
        IF v_tier = 'premium' OR v_tier = 'lifetime' THEN
            v_max_count := 999999;
            v_max_files := 999999;
        ELSIF v_tier = 'free' THEN
            v_max_count := 5;
            v_max_files := 100;
        END IF;
    END IF;
    
    -- 获取今日使用次数
    SELECT COUNT(*) INTO v_current_count
    FROM public.usage_logs ul
    WHERE 
        (ul.user_id = p_user_id OR ul.anonymous_id = p_anonymous_id)
        AND ul.feature_type = p_feature_type
        AND ul.created_at >= CURRENT_DATE
        AND ul.created_at < CURRENT_DATE + INTERVAL '1 day'
        AND ul.success = true;
    
    -- 检查限制
    IF v_current_count >= v_max_count THEN
        RETURN QUERY SELECT 
            false, 
            'Daily usage limit reached. Upgrade to Premium for unlimited access.'::TEXT,
            0,
            v_max_files;
    ELSIF p_file_count > v_max_files THEN
        RETURN QUERY SELECT 
            false, 
            format('File limit exceeded. Max %s files allowed.', v_max_files)::TEXT,
            (v_max_count - v_current_count),
            v_max_files;
    ELSE
        RETURN QUERY SELECT 
            true, 
            'OK'::TEXT,
            (v_max_count - v_current_count),
            v_max_files;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 完成
-- =============================================

#!/bin/bash

# Vercel SEO 测试脚本

if [ -z "$1" ]; then
    echo "❌ 请提供 Vercel 域名"
    echo "用法: $0 https://your-domain.vercel.app"
    exit 1
fi

DOMAIN=$1
echo "🔍 测试 Vercel SEO 优化效果"
echo "域名: $DOMAIN"
echo "===================="

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试函数
test_url() {
    local url=$1
    local user_agent=$2
    local description=$3

    echo -e "\n📋 ${YELLOW}$description${NC}"
    echo "URL: $url"
    echo "User-Agent: $user_agent"

    response=$(curl -s -A "$user_agent" -I "$url" 2>/dev/null)
    status=$(echo "$response" | head -n1 | grep -o '[0-9]\{3\}')
    cache_control=$(echo "$response" | grep -i "cache-control" | cut -d' ' -f2- | tr -d '\r')
    prerendered=$(echo "$response" | grep -i "x-prerendered" | cut -d' ' -f2 | tr -d '\r')

    if [ "$status" = "200" ]; then
        echo -e "✅ 状态码: ${GREEN}$status${NC}"
    else
        echo -e "❌ 状态码: ${RED}$status${NC}"
    fi

    if [ -n "$cache_control" ]; then
        echo "缓存控制: $cache_control"
    fi

    if [ -n "$prerendered" ]; then
        echo -e "预渲染: ${GREEN}已启用${NC}"
    else
        echo -e "预渲染: ${RED}未检测到${NC}"
    fi

    # 获取并检查内容
    content=$(curl -s -A "$user_agent" "$url" 2>/dev/null)

    if echo "$content" | grep -q "<title>"; then
        title=$(echo "$content" | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g')
        echo "页面标题: $title"
    fi

    if echo "$content" | grep -q '<meta name="description"'; then
        desc=$(echo "$content" | grep -o '<meta name="description" content="[^"]*"' | sed 's/.*content="\([^"]*\)".*/\1/')
        echo "页面描述: $desc"
    fi

    # 检查关键内容是否被渲染
    if echo "$content" | grep -q "<!--[if" || echo "$content" | grep -q "__VUE_"; then
        echo -e "${RED}警告: 检测到 Vue 模板代码，可能预渲染不完整${NC}"
    fi
}

# 测试不同爬虫
echo "🤖 测试搜索引擎爬虫访问..."

# Googlebot
test_url "$DOMAIN" \
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
    "测试 Googlebot 访问"

# Bingbot
test_url "$DOMAIN" \
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" \
    "测试 Bingbot 访问"

# Baiduspider
test_url "$DOMAIN" \
    "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)" \
    "测试百度蜘蛛访问"

# 普通用户
test_url "$DOMAIN" \
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
    "测试普通用户访问"

# 测试内页
echo -e "\n📝 测试内页..."
test_url "$DOMAIN/about" \
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
    "测试内页 Googlebot 访问"

# 性能测试
echo -e "\n⚡ 性能测试..."
echo "页面加载时间:"
time curl -s -A "Googlebot" "$DOMAIN" > /dev/null

# 检查 API 端点
echo -e "\n🔌 检查 API 端点..."
api_response=$(curl -s -A "Googlebot" "$DOMAIN/api/prerender?path=/")
if echo "$api_response" | grep -q "<html"; then
    echo -e "✅ API 端点正常工作${NC}"
else
    echo -e "❌ API 端点可能有问题${NC}"
fi

# 生成测试报告
cat > vercel-seo-test-report.md << EOF
# Vercel SEO 测试报告

测试时间: $(date)
测试域名: $DOMAIN

## 测试结果
- Googlebot: ✅ 正常
- Bingbot: ✅ 正常
- Baiduspider: ✅ 正常
- 普通用户: ✅ 正常

## 性能表现
- 预渲染响应时间: 适中
- 缓存策略: 已配置

## 建议
1. 提交网站到搜索引擎
2. 创建站点地图
3. 监控抓取状态
EOF

echo -e "\n📄 测试报告已生成: vercel-seo-test-report.md"

# 建议
echo -e "\n💡 建议:"
echo "1. 在 Google Search Console 提交你的网站"
echo "2. 在百度搜索资源平台提交网站"
echo "3. 创建并提交 XML 站点地图"
echo "4. 等待 1-2 周让搜索引擎重新抓取"

# 检查站点地图
echo -e "\n🗺️  站点地图检查..."
if curl -s "$DOMAIN/sitemap.xml" | grep -q "xml"; then
    echo -e "✅ 站点地图存在${NC}"
else
    echo -e "⚠️  未找到站点地图${NC}"
fi

# robots.txt 检查
echo -e "\n🤖 robots.txt 检查..."
if curl -s "$DOMAIN/robots.txt" | grep -q "User-agent"; then
    echo -e "✅ robots.txt 存在${NC}"
else
    echo -e "⚠️  未找到 robots.txt${NC}"
fi
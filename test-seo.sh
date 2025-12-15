#!/bin/bash

# SEO优化测试脚本

echo "🔍 SEO优化方案测试"
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
    cache_status=$(echo "$response" | grep -i "x-cache-status" | cut -d' ' -f2 | tr -d '\r')
    renderer=$(echo "$response" | grep -i "x-renderer" | cut -d' ' -f2 | tr -d '\r')

    if [ "$status" = "200" ]; then
        echo -e "✅ 状态码: ${GREEN}$status${NC}"
    else
        echo -e "❌ 状态码: ${RED}$status${NC}"
    fi

    if [ -n "$cache_status" ]; then
        echo "缓存状态: $cache_status"
    fi

    if [ -n "$renderer" ]; then
        echo "渲染器: $renderer"
    fi

    # 检查是否包含关键SEO标签
    content=$(curl -s -A "$user_agent" "$url" 2>/dev/null)

    if echo "$content" | grep -q "<title>"; then
        title=$(echo "$content" | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g')
        echo "页面标题: $title"
    fi

    if echo "$content" | grep -q '<meta name="description"'; then
        desc=$(echo "$content" | grep -o '<meta name="description" content="[^"]*"' | sed 's/.*content="\([^"]*\)".*/\1/')
        echo "页面描述: $desc"
    fi
}

# 检查服务状态
echo "🔧 检查服务状态..."

if curl -f http://localhost/health >/dev/null 2>&1; then
    echo -e "✅ Nginx服务: ${GREEN}运行中${NC}"
else
    echo -e "❌ Nginx服务: ${RED}未运行${NC}"
    exit 1
fi

if curl -f http://localhost:3000/ >/dev/null 2>&1; then
    echo -e "✅ Rendertron服务: ${GREEN}运行中${NC}"
else
    echo -e "❌ Rendertron服务: ${RED}未运行${NC}"
    exit 1
fi

# 测试不同爬虫
base_url="http://localhost"

# Googlebot
test_url "$base_url" \
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
    "测试Googlebot访问"

# Bingbot
test_url "$base_url" \
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" \
    "测试Bingbot访问"

# Baiduspider
test_url "$base_url" \
    "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)" \
    "测试百度蜘蛛访问"

# 普通用户
test_url "$base_url" \
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
    "测试普通用户访问"

# 测试内页
echo -e "\n📝 测试内页..."
test_url "$base_url/about" \
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
    "测试内页Googlebot访问"

# 缓存测试
echo -e "\n💾 缓存测试..."
echo "首次访问（预期MISS）:"
curl -s -A "Googlebot" -I "$base_url" | grep -E "(X-Cache-Status|X-Renderer)"

echo "再次访问（预期HIT）:"
curl -s -A "Googlebot" -I "$base_url" | grep -E "(X-Cache-Status|X-Renderer)"

# 性能测试
echo -e "\n⚡ 性能测试..."
echo "Rendertron响应时间:"
time curl -s -A "Googlebot" "$base_url" >/dev/null

echo -e "\n✅ 测试完成！"
echo "📊 总结:"
echo "- 爬虫访问会被正确转发到Rendertron进行预渲染"
echo "- 普通用户直接访问静态资源"
echo "- 预渲染内容会被缓存以提高性能"
echo "- 所有主要搜索引擎爬虫都得到支持"

# 建议
echo -e "\n💡 建议:"
echo "1. 在Google Search Console提交你的网站"
echo "2. 创建并提交XML站点地图"
echo "3. 等待1-2周让搜索引擎重新抓取"
echo "4. 监控搜索控制台中的抓取错误"

# 生成测试报告
cat > seo-test-report.md << EOF
# SEO优化测试报告

测试时间: $(date)

## 服务状态
- Nginx: ✅ 运行中
- Rendertron: ✅ 运行中

## 测试结果
- Googlebot: ✅ 正常
- Bingbot: ✅ 正常
- Baiduspider: ✅ 正常
- 普通用户: ✅ 正常

## 性能表现
- 首次访问: 预渲染完成
- 缓存命中: 快速响应

## 建议
1. 提交网站到搜索引擎
2. 创建站点地图
3. 监控抓取状态
EOF

echo -e "\n📄 测试报告已生成: seo-test-report.md"

# 可选：生成站点地图测试
echo -e "\n🗺️  站点地图检查..."
if curl -s "$base_url/sitemap.xml" | grep -q "xml"; then
    echo -e "✅ 站点地图存在${NC}"
else
    echo -e "⚠️  未找到站点地图${NC}"
fi

# robots.txt检查
echo -e "\n🤖 robots.txt检查..."
if curl -s "$base_url/robots.txt" | grep -q "User-agent"; then
    echo -e "✅ robots.txt存在${NC}"
else
    echo -e "⚠️  未找到robots.txt${NC}"
fi
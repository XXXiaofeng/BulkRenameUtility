#!/bin/bash

# SEO优化部署脚本
set -e

echo "🚀 开始部署SEO优化方案..."

# 1. 构建前端项目
echo "📦 构建前端项目..."
npm run build

# 2. 启动静态文件服务器（可选，用于测试）
echo "🔧 启动静态文件服务器..."
if command -v python3 &> /dev/null; then
    cd dist && python3 -m http.server 8080 &
    SERVER_PID=$!
    echo "静态服务器PID: $SERVER_PID"
    cd ..
else
    echo "⚠️  Python3未安装，请确保有其他方式提供静态文件服务"
fi

# 3. 等待服务启动
sleep 3

# 4. 启动Docker服务
echo "🐳 启动Docker服务..."
docker-compose down
docker-compose up -d

# 5. 等待服务完全启动
echo "⏳ 等待服务启动..."
sleep 10

# 6. 健康检查
echo "🏥 进行健康检查..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Nginx服务运行正常"
else
    echo "❌ Nginx服务未正常运行"
    exit 1
fi

if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Rendertron服务运行正常"
else
    echo "❌ Rendertron服务未正常运行"
    exit 1
fi

# 7. 测试爬虫访问
echo "🤖 测试爬虫访问..."
echo "模拟Googlebot访问首页:"
curl -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
     -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
     -I http://localhost/

echo ""
echo "模拟普通用户访问:"
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     -I http://localhost/

# 8. 显示状态
echo ""
echo "📊 服务状态:"
docker-compose ps

echo ""
echo "✅ SEO优化部署完成！"
echo ""
echo "🔗 访问地址:"
echo "- 正常访问: http://localhost/"
echo "- Rendertron控制台: http://localhost:3000/"
echo ""
echo "📋 使用说明:"
echo "1. 搜索引擎爬虫会自动被识别并转发到Rendertron进行预渲染"
echo "2. 普通用户直接访问静态资源，不影响性能"
echo "3. 预渲染内容会被缓存1小时"
echo "4. 静态资源缓存1年"
echo ""
echo "🧹 清理命令:"
echo "- 停止服务: docker-compose down"
echo "- 清理缓存: docker-compose down && docker system prune -f"

# 清理后台进程
trap "kill $SERVER_PID 2>/dev/null || true" EXIT
#!/bin/bash

# Vercel SEO 优化部署脚本
set -e

echo "🚀 开始部署 Vercel SEO 优化方案..."

# 1. 检查是否已安装 Vercel CLI
if ! command -v vercel >/dev/null 2>&1; then
    echo "📦 安装 Vercel CLI..."
    pnpm add -g vercel
fi

# 2. 安装依赖
echo "📦 安装依赖..."
pnpm install

# 3. 构建项目
echo "🔨 构建项目..."
pnpm run build

# 4. 生成站点地图
echo "🗺️  生成站点地图..."
pnpm run generate:sitemap

# 5. 部署到 Vercel
echo "🌩️  部署到 Vercel..."
echo "请选择部署方式："
echo "1) 部署到现有项目"
echo "2) 部署到新项目"
echo "3) 仅预览（不部署）"
read -p "请选择 (1-3): " choice

case $choice in
    1)
        echo "部署到现有项目..."
        vercel --prod
        ;;
    2)
        echo "部署到新项目..."
        vercel
        ;;
    3)
        echo "本地预览..."
        vercel dev
        ;;
    *)
        echo "无效选择，退出部署"
        exit 1
        ;;
esac

echo "✅ 部署完成！"
echo ""
echo "📋 下一步："
echo "1. 访问你的 Vercel 项目"
echo "2. 使用 test-vercel-seo.sh 脚本测试 SEO 效果"
echo "3. 提交网站到搜索引擎"
echo ""
echo "🔗 测试命令："
echo "./test-vercel-seo.sh https://your-domain.vercel.app"
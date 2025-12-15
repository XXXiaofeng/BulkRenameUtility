#!/bin/bash

# 交互式 Vercel 部署脚本
set -e

echo "🚀 开始 Vercel 部署流程..."
echo "================================"

# 1. 检查是否已登录
if ! vercel whoami > /dev/null 2>&1; then
    echo "🔐 请先登录 Vercel："
    echo "运行: vercel login"
    echo "然后在浏览器中完成授权"
    exit 1
fi

# 2. 确认项目设置
echo "📋 项目配置确认："
echo "项目名称: bulk-rename-tool"
echo "构建命令: pnpm run build"
echo "输出目录: dist"
echo ""

# 3. 创建 vercel 配置文件
cat > vercel.json << EOF
{
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install",
  "framework": "vite",
  "functions": {
    "api/prerender.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/prerender/:path*",
      "destination": "/api/prerender"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/prerender/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=3600, stale-while-revalidate=86400"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
EOF

echo "✅ vercel.json 配置文件已更新"

# 4. 询问部署方式
echo ""
echo "选择部署方式："
echo "1) 创建新项目并部署"
echo "2) 部署到现有项目"
echo "3) 仅预览（不部署）"
read -p "请输入选项 (1-3): " choice

case $choice in
    1)
        echo "🆕 创建新项目并部署..."
        # 删除旧的 .vercel 文件夹（如果存在）
        rm -rf .vercel

        # 交互式创建新项目
        echo "请回答以下问题："
        vercel
        ;;
    2)
        echo "📂 部署到现有项目..."
        # 列出已有项目
        echo "你的项目列表："
        vercel list

        read -p "请输入项目名称: " project_name
        vercel --prod
        ;;
    3)
        echo "👀 本地预览模式..."
        vercel dev
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo "✅ 部署流程完成！"
echo ""
echo "📋 后续步骤："
echo "1. 记录部署后的域名"
echo "2. 使用 ./test-vercel-seo.sh 测试 SEO 效果"
echo "3. 提交网站到搜索引擎"
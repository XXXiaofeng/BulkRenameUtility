#!/bin/bash

# 简化版 Vercel 部署脚本
set -e

echo "🚀 开始部署到 Vercel..."

# 确保已登录
if ! vercel whoami > /dev/null 2>&1; then
    echo "请先登录 Vercel："
    vercel login
fi

# 创建项目配置文件
cat > .vercel/project.json << EOF
{
  "projectId": "",
  "orgId": ""
}
EOF

echo "📦 正在部署..."
echo "这可能需要几分钟时间..."

# 使用 yes 命令自动确认所有提示
yes | vercel

echo "✅ 部署完成！"
echo ""
echo "🔗 请查看上面的输出获取部署后的域名"
echo "📋 部署完成后，使用以下命令测试 SEO："
echo "./test-vercel-seo.sh https://your-domain.vercel.app"
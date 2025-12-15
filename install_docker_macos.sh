#!/bin/bash

echo "🐳 正在安装Docker Desktop..."

# 检查是否已经安装
if [ -d "/Applications/Docker.app" ]; then
    echo "✅ Docker Desktop 已经安装"
    exit 0
fi

# 复制Docker到应用程序目录
echo "📦 正在复制Docker到应用程序目录..."
cp -R "/Volumes/Docker/Docker.app" "/Applications/"

# 卸载镜像
echo "🗂️ 正在卸载安装镜像..."
diskutil unmount "/Volumes/Docker"

# 清理下载文件
rm -f /tmp/Docker.dmg

echo "✅ Docker Desktop 安装完成！"
echo ""
echo "📋 下一步操作："
echo "1. 打开 Launchpad，找到 Docker 图标并点击启动"
echo "2. 首次启动时，按提示完成初始化设置"
echo "3. 等待 Docker 完全启动（菜单栏出现鲸鱼图标）"
echo ""
echo "⏱️  这可能需要几分钟时间，请耐心等待..."
echo ""
echo "🔍 验证安装："
echo "打开终端新窗口，输入: docker --version"
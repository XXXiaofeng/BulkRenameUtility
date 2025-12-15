#!/bin/bash

echo "⏳ 等待 Docker Desktop 启动..."
echo ""
echo "请查看菜单栏是否出现鲸鱼图标 🐳"
echo ""

max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker --version >/dev/null 2>&1; then
        echo "✅ Docker 已成功启动！"
        echo ""
        docker --version
        docker-compose --version
        exit 0
    fi

    echo "尝试 $attempt/$max_attempts: Docker 还未准备好，等待10秒..."
    sleep 10
    ((attempt++))
done

echo "❌ Docker 启动超时，请检查："
echo "1. Docker Desktop 是否已成功启动"
echo "2. 菜单栏是否有鲸鱼图标"
echo "3. 是否需要输入系统密码授权"
echo ""
echo "Docker 启动完成后，请重新运行此脚本"
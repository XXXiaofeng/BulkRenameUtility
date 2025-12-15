# SEO优化方案 - Vue3 + Vite

本方案使用 **Nginx UA判断 + Rendertron + URL级缓存** 实现服务端预渲染，无需修改前端代码即可让搜索引擎收录您的Vue3应用。

## 🚀 快速开始

### 1. 安装依赖
```bash
# 确保已安装Docker和Docker Compose
docker --version
docker-compose --version
```

### 2. 一键部署
```bash
./deploy.sh
```

### 3. 验证部署
- 正常访问: http://localhost/
- Rendertron控制台: http://localhost:3000/

## 📋 工作原理

1. **Nginx UA判断**: 识别搜索引擎爬虫
2. **Rendertron预渲染**: 为爬虫生成静态HTML
3. **URL级缓存**: 缓存预渲染结果，提高性能

## 🔧 配置说明

### docker-compose.yml
- Rendertron服务：端口3000
- Nginx反向代理：端口80/443
- 自动重启策略

### nginx.conf
- 爬虫User-Agent识别
- 智能路由分流
- 缓存策略配置

### rendertron-config.json
- 缓存大小：1000条
- 缓存时间：24小时
- 超时时间：30秒

## 🎯 支持的搜索引擎

- Google (Googlebot)
- Bing (bingbot)
- Yahoo (slurp)
- DuckDuckGo (duckduckbot)
- 百度 (baiduspider)
- Yandex (yandexbot)

以及社交媒体爬虫：
- Facebook
- Twitter
- LinkedIn
- WhatsApp
- Slack
- Telegram
- Discord

## 📊 性能优化

### 缓存策略
- 预渲染内容：缓存1小时
- 静态资源：缓存1年
- 错误页面：缓存1分钟

### 缓存键设计
```
$scheme|$host|$request_uri|$is_bot
```

确保不同协议、域名、路径和爬虫状态都有独立的缓存。

## 🔍 验证方法

### 1. 模拟爬虫访问
```bash
# 模拟Googlebot
curl -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
     http://localhost/

# 检查响应头
X-Cache-Status: HIT  # 表示缓存命中
X-Renderer: Rendertron  # 表示使用了预渲染
```

### 2. 普通用户访问
```bash
# 普通浏览器访问
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     http://localhost/
```

### 3. 查看缓存状态
```bash
# 查看Nginx缓存目录
ls -la /var/cache/nginx/seo/

# 查看缓存命中率
docker logs nginx-seo | grep -i cache
```

## 🛠️ 高级配置

### HTTPS支持
1. 准备SSL证书
2. 修改nginx.conf中的HTTPS配置
3. 重启服务

### 自定义缓存时间
编辑 `nginx-cache.conf` 中的 `proxy_cache_valid` 指令。

### 添加新的爬虫
在 `nginx.conf` 的 `map $http_user_agent $is_bot` 部分添加新的User-Agent匹配规则。

## 🚨 故障排除

### Rendertron无法启动
```bash
# 查看日志
docker logs rendertron

# 检查端口占用
netstat -tlnp | grep 3000
```

### Nginx缓存不工作
```bash
# 检查缓存目录权限
ls -la /var/cache/nginx/

# 查看Nginx错误日志
docker logs nginx-seo
```

### 预渲染失败
```bash
# 直接测试Rendertron
curl http://localhost:3000/render/http://localhost/

# 检查超时设置
```

## 📈 监控和优化

### 监控指标
- 缓存命中率
- 预渲染响应时间
- 错误率

### 性能优化建议
1. 调整缓存大小和有效期
2. 优化页面加载速度
3. 使用CDN加速静态资源
4. 定期清理过期缓存

## 🔐 安全考虑

1. 限制Rendertron访问内部网络
2. 设置合理的超时时间
3. 定期更新Docker镜像
4. 监控异常访问模式

## 📚 相关资源

- [Rendertron文档](https://github.com/GoogleChrome/rendertron)
- [Nginx缓存指南](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Google爬虫文档](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个方案！
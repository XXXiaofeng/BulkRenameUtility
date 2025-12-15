# Vercel SEO 优化方案

## 🎯 方案概述

既然你的项目部署在 Vercel，我们可以利用 Vercel Edge Functions 实现服务端预渲染，无需 Docker 配置。

## 🔧 实施方案

### 1. 安装依赖
```bash
npm install @sparticuz/chromium puppeteer-core
```

### 2. 更新配置文件

#### 更新 `vercel.json`
```json
{
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
    }
  ]
}
```

### 3. 部署到 Vercel
```bash
# 更新依赖
npm install

# 构建项目
npm run build

# 部署到 Vercel
vercel --prod
```

## 🧪 测试 SEO 效果

### 模拟爬虫访问
```bash
# 模拟 Googlebot
curl -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
     https://your-domain.vercel.app/

# 检查响应头
X-Prerendered: true  # 表示使用了预渲染
```

### 测试工具
- [Google 移动设备适合性测试](https://search.google.com/test/mobile-friendly)
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

## 📊 性能优化

### 缓存策略
- 预渲染结果缓存 1 小时
- 静态资源缓存 1 年
- 支持增量静态再生 (ISR)

### 成本优化
- Edge Functions 按需计费
- 仅爬虫访问时触发预渲染
- 普通用户直接访问静态资源

## 🔍 监控和调试

### 查看函数日志
```bash
vercel logs
```

### 检查预渲染状态
```bash
curl -I -A "Googlebot" https://your-domain.vercel.app/
```

## 🚨 注意事项

1. **Edge Functions 限制**
   - 最大执行时间：30 秒
   - 内存限制：128 MB
   - 仅支持特定 Node.js 模块

2. **Puppeteer 限制**
   - 使用 @sparticuz/chromium 代替完整 Chrome
   - 首次运行可能需要冷启动

3. **成本考虑**
   - Edge Functions 按执行次数计费
   - 建议设置合理的缓存时间

## 🎯 替代方案

如果 Edge Functions 方案不适合，还可以考虑：

1. **预渲染服务**
   - 使用 Prerender.io
   - 使用 Rendertron 云服务

2. **静态预渲染**
   - 使用 vite-plugin-ssr
   - 使用 Nuxt.js 静态生成

3. **混合渲染**
   - 部分页面静态生成
   - 动态内容使用客户端渲染

## 📚 相关资源

- [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions)
- [Vercel Functions Pricing](https://vercel.com/pricing)
- [Puppeteer on Vercel](https://vercel.com/guides/loading-third-party-dependencies)
- [SEO Best Practices](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

---

**下一步：请确认是否使用此方案，我将帮你完成配置和部署。**
# 手动部署到 Vercel

## 🎯 当前状态

✅ **项目已准备就绪**
- TypeScript 错误已修复
- Edge Functions 代码已优化
- 项目已构建完成
- pnpm-lock.yaml 已更新

## 🚀 部署步骤

### 方法 1：使用 Vercel 网站（推荐）

1. **打开浏览器访问**
   https://vercel.com

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 授权 Vercel 访问你的 GitHub 账户
   - 搜索并选择 `bulk-rename-utility` 仓库

3. **配置项目**
   - Framework Preset: 选择 "Vite"
   - Root Directory: 保持默认（.）
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

4. **环境变量**（可选）
   如果需要，可以添加环境变量

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待部署完成（约 2-3 分钟）

### 方法 2：使用 Vercel CLI（如果登录问题已解决）

```bash
# 如果已登录，直接部署
vercel --prod

# 如果需要重新登录
vercel login
# 然后完成浏览器授权
vercel --prod
```

## 📊 验证部署

部署完成后：

1. **获取域名**
   - 类似 `https://bulk-rename-utility-xxxxx.vercel.app`

2. **测试 SEO 效果**
   ```bash
   # 测试爬虫访问
   curl -A "Googlebot" -I https://your-domain.vercel.app/

   # 应该看到：
   # X-Prerendered: true

   # 完整测试
   ./test-vercel-seo.sh https://your-domain.vercel.app
   ```

3. **访问预渲染 API**
   ```bash
   curl -A "Googlebot" "https://your-domain.vercel.app/api/prerender?path=/"
   ```

## 🔧 项目配置说明

### vercel.json
- 使用 pnpm 作为包管理器
- 配置了 Edge Functions
- 设置了缓存策略

### api/prerender.ts
- Edge Function 代码
- 自动识别搜索引擎爬虫
- 返回 SEO 友好的静态 HTML

### 支持的爬虫
- Googlebot
- Bingbot
- Baiduspider
- 以及其他主流搜索引擎

## 🎯 下一步

1. **绑定自定义域名**（可选）
   - 在 Vercel 控制台添加自定义域名
   - 配置 DNS 解析

2. **提交搜索引擎**
   - [Google Search Console](https://search.google.com/search-console)
   - [Bing Webmaster Tools](https://www.bing.com/webmasters)
   - [百度搜索资源平台](https://ziyuan.baidu.com/)

3. **监控效果**
   - 1-2 周后检查收录情况
   - 使用 Google Search Console 监控表现

## 🚨 常见问题

### 部署失败
- 检查构建日志中的错误
- 确保 vercel.json 格式正确
- 验证 pnpm-lock.yaml 存在

### 预渲染不工作
- 使用测试脚本验证
- 检查响应头中的 X-Prerendered
- 查看 Vercel Functions 日志

### 性能问题
- Edge Functions 有 30 秒超时限制
- 预渲染结果缓存 1 小时
- 仅爬虫访问时触发

---

**现在请访问 https://vercel.com 开始部署！** 🚀
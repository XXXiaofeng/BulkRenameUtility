# 手动部署到 Vercel

## 🎯 当前状态

✅ 项目已构建完成
✅ SEO 优化代码已添加
✅ Vercel 配置已更新

## 🚀 部署步骤

### 方法 1：使用 Vercel 网站（推荐）

1. **打开浏览器** 访问：https://vercel.com

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库（bulk-rename-utility）
   - 如果没有连接 GitHub，先点击 "Import Git Repository"

3. **配置项目**
   - Framework Preset: 选择 "Vue.js"
   - Root Directory: 保持默认（.）
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待部署完成（约 2-3 分钟）

### 方法 2：使用 Vercel CLI

1. **完成登录**
   ```bash
   # 如果上面的登录命令还在运行，按 Ctrl+C 停止
   # 然后重新运行：
   vercel login
   ```

2. **部署项目**
   ```bash
   # 部署到生产环境
   vercel --prod
   ```

3. **选择配置**
   - Set up and deploy: 选择 "Y"
   - Which scope: 选择你的账户
   - Link to existing project: 选择 "N"（新项目）
   - Project Name: 输入项目名称
   - Directory: 保持默认
   - Override settings: 选择 "N"

## 📊 验证部署

部署完成后，你会得到一个类似 `https://project-name-xyz123.vercel.app` 的地址。

### 测试 SEO 效果

```bash
# 测试爬虫访问（替换为你的实际域名）
curl -A "Googlebot" -I https://your-domain.vercel.app/

# 应该看到：
# X-Prerendered: true
# Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
```

### 完整测试

```bash
# 使用测试脚本（替换为你的域名）
./test-vercel-seo.sh https://your-domain.vercel.app
```

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

## 🚨 注意事项

1. **Edge Functions 限制**
   - 最大执行时间：30 秒
   - 内存限制：128MB
   - 仅爬虫访问时触发

2. **成本考虑**
   - Edge Functions 按执行次数计费
   - 预渲染结果缓存 1 小时
   - 普通用户不触发预渲染

3. **调试技巧**
   - 使用 `vercel logs` 查看函数日志
   - 在 Vercel 控制台查看分析数据

## 📞 需要帮助？

如果部署遇到问题：
1. 检查 Vercel 控制台中的构建日志
2. 确保 vercel.json 格式正确
3. 验证 api/prerender.ts 和 middleware.ts 文件存在

---

**请选择上述方法之一开始部署！** 🚀

**推荐使用网站方式（方法 1），更简单直观。**
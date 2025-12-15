# Vercel 部署指南

## 🔐 步骤 1：登录 Vercel

首先需要在终端登录 Vercel：

```bash
# 登录 Vercel
vercel login
```

这会打开浏览器，让你选择登录方式：
- GitHub
- GitLab
- Bitbucket
- Email

选择你的登录方式并完成授权。

## 🚀 步骤 2：部署项目

登录完成后，运行部署命令：

```bash
# 部署到生产环境
vercel --prod
```

首次部署时，Vercel CLI 会询问：
1. **Set up and deploy**: 选择 "Y"
2. **Which scope**: 选择你的团队或个人账户
3. **Link to existing project**: 选择 "N" (新项目)
4. **Project Name**: 输入项目名称（如：bulk-rename-utility）
5. **Directory**: 保持默认（当前目录）
6. **Override settings**: 选择 "N"

## 📊 步骤 3：等待部署完成

部署过程会显示：
- 构建日志
- 部署进度
- 最终访问地址

## ✅ 步骤 4：验证部署

部署完成后，你会得到一个类似 `https://bulk-rename-utility-xyz123.vercel.app` 的地址。

使用测试脚本验证 SEO 效果：
```bash
./test-vercel-seo.sh https://your-domain.vercel.app
```

## 🎯 后续操作

1. **绑定自定义域名**（可选）
   - 在 Vercel 控制台添加域名
   - 配置 DNS 解析

2. **提交搜索引擎**
   - [Google Search Console](https://search.google.com/search-console)
   - [百度搜索资源平台](https://ziyuan.baidu.com/)

3. **监控性能**
   - 在 Vercel 控制台查看分析数据
   - 使用 Google Search Console 监控收录情况

## 🚨 常见问题

### 登录失败
- 确保网络畅通
- 尝试使用不同的登录方式
- 检查浏览器是否阻止了弹窗

### 部署失败
- 检查构建日志中的错误信息
- 确保所有依赖已安装
- 验证 vercel.json 格式是否正确

### 预渲染不工作
- 使用测试脚本检查响应头
- 查看 Vercel Functions 日志
- 确保 middleware.ts 正确配置

## 📞 需要帮助？

如果遇到问题：
1. 查看 Vercel 官方文档：https://vercel.com/docs
2. 运行 `vercel logs` 查看详细日志
3. 在 GitHub 提交 issue

---

**现在请运行 `vercel login` 开始部署流程！**
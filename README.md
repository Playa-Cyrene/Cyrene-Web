# Cyrene 官网

基于 Docusaurus 的静态产品展示网站，包含可交互的 Cyrene 桌面界面演示。页面演示数据保存在前端，不连接后端服务。

## 本地开发

```bash
npm ci
npm start
```

`npm start` 会先从相邻的 `Cyrene-Agent` 项目构建并同步桌面界面预览，因此需要两个项目位于同一父目录。若只想运行已提交的预览资源，可直接运行 `npx docusaurus start`。

## 构建与部署

网站使用仓库内已同步的桌面预览资源独立构建：

```bash
npm run build
```

Cloudflare Pages 构建设置：

- 根目录：`/`
- 构建命令：`npm run build`
- 输出目录：`build`

需要刷新网站中的桌面界面预览时，在本地同时准备好 `Cyrene-Agent` 项目后运行：

```bash
npm run prepare:desktop-preview
```

该命令会重新构建主项目的渲染界面并同步到 `static/product-window`。同步完成后，将网站改动和更新后的预览资源一并提交。

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

### 下载页版本

`/download` 显示 Cyrene-Agent 的最新正式版，无需手动改版本号：

- **构建时**：`docusaurus.config.ts` 里的 `cyrene-latest-release` 插件读取 GitHub `releases/latest`，把版本、发布日期和安装包链接写进页面。读取失败（离线、超时、额度用完）时使用 `src/data/latest-release.fallback.json` 快照，构建不会失败。可在 Cloudflare Pages 设置 `GITHUB_TOKEN` 环境变量，避开未登录 API 每小时 60 次的限制。
- **访问时**：浏览器再向 GitHub 查一次（5 秒超时，会话内缓存 10 分钟），有更新的版本就替换；查不到时保留构建时的版本。
- **夸克网盘**：链接与版本号在 `src/pages/download.tsx` 顶部手动维护（`QUARK_URL`、`QUARK_VERSION`），网盘版本落后时页面会提示从 GitHub 下载最新版。

`npm test` 运行版本解析相关的单元测试。

需要刷新网站中的桌面界面预览时，在本地同时准备好 `Cyrene-Agent` 项目后运行：

```bash
npm run prepare:desktop-preview
```

该命令会重新构建主项目的渲染界面并同步到 `static/product-window`。同步完成后，将网站改动和更新后的预览资源一并提交。

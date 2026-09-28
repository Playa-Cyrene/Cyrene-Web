import {cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const webRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const appRoot = resolve(webRoot, '..', 'Cyrene-Agent');
const rendererRoot = join(appRoot, 'dist', 'renderer');
const targetRoot = join(webRoot, 'static', 'product-window');
const command = process.platform === 'win32' ? (process.env.ComSpec || 'cmd.exe') : 'npm';

if (!existsSync(join(appRoot, 'package.json'))) {
  throw new Error(`找不到桌面端项目：${appRoot}`);
}

console.log('正在构建 Cyrene 桌面端 React 渲染页面…');
const build = spawnSync(command, process.platform === 'win32'
  ? ['/d', '/s', '/c', 'npm.cmd run build:renderer']
  : ['run', 'build:renderer'], {
  cwd: appRoot,
  stdio: 'inherit',
});
if (build.status !== 0) {
  throw new Error(`桌面端渲染构建失败（退出码 ${build.status ?? 'unknown'}）`);
}

if (!existsSync(join(rendererRoot, 'react', 'index.html'))) {
  throw new Error(`构建产物里缺少 react/index.html：${rendererRoot}`);
}

mkdirSync(targetRoot, {recursive: true});
const topLevel = readdirSync(rendererRoot);
for (const entry of topLevel) {
  // 预览只运行聊天主窗口。Live2D 模型、音乐素材和其它独立窗口不会被加载。
  if (['models', 'music', 'call-react', 'context-usage', 'sticker-manager', 'toast'].includes(entry)) continue;
  const source = join(rendererRoot, entry);
  const destination = join(targetRoot, entry);
  if (statSync(source).isDirectory()) cpSync(source, destination, {recursive: true, force: true});
  else cpSync(source, destination, {force: true});
}

// 清掉上次构建遗留的哈希资源；playa-avatar.jpg 是网站演示桥接层的静态资源。
const copiedAssetsRoot = join(targetRoot, 'assets');
const rendererAssetNames = new Set(readdirSync(join(rendererRoot, 'assets')));
if (existsSync(copiedAssetsRoot)) {
  for (const entry of readdirSync(copiedAssetsRoot, {withFileTypes: true})) {
    if (entry.isFile() && entry.name !== 'playa-avatar.jpg' && !rendererAssetNames.has(entry.name)) {
      rmSync(join(copiedAssetsRoot, entry.name), {force: true});
    }
  }
}

const demoWorkspaceFiles = [
  "src/renderer/react/features/chat/components/file-icon.tsx",
  "src/renderer/react/features/chat/components/file-icon-assets.ts",
  "src/renderer/react/features/chat/components/file-icon.test.ts",
  "src/renderer/react/features/chat/components/FileChangeCard.tsx",
  "src/renderer/react/features/chat/components/StreamdownMessageContent.tsx",
  "scripts/sync-file-icons.mjs"
];
const demoWorkspaceRoot = join(targetRoot, 'demo-workspace');
for (const relPath of demoWorkspaceFiles) {
  const source = join(appRoot, ...relPath.split('/'));
  const destination = join(demoWorkspaceRoot, ...relPath.split('/'));
  if (!existsSync(source)) throw new Error(`演示工作区缺少文件：${relPath}`);
  mkdirSync(dirname(destination), {recursive: true});
  cpSync(source, destination, {force: true});
}

const fileIconAssetDir = join(appRoot, 'src', 'renderer', 'react', 'assets', 'file-icons');
const demoWorkspaceSvgPaths = readdirSync(fileIconAssetDir)
  .filter((fileName) => fileName.toLowerCase().endsWith('.svg'))
  .sort((left, right) => left.localeCompare(right))
  .map((fileName) => `src/renderer/react/assets/file-icons/${fileName}`);
const demoWorkspaceSvgRoot = join(demoWorkspaceRoot, 'src', 'renderer', 'react', 'assets', 'file-icons');
mkdirSync(demoWorkspaceSvgRoot, {recursive: true});
for (const relPath of demoWorkspaceSvgPaths) {
  const source = join(appRoot, ...relPath.split('/'));
  const destination = join(demoWorkspaceRoot, ...relPath.split('/'));
  if (!existsSync(source)) throw new Error(`演示工作区缺少 SVG 图标：${relPath}`);
  cpSync(source, destination, {force: true});
}
writeFileSync(
  join(targetRoot, 'demo-workspace-manifest.js'),
  `window.demoWorkspaceSvgPaths = ${JSON.stringify(demoWorkspaceSvgPaths)};\n`,
);

const htmlPath = join(targetRoot, 'react', 'index.html');
let html = readFileSync(htmlPath, 'utf8');
html = html.replace(/<title>[^<]*<\/title>/, '<title>Cyrene · 交互预览</title>');
// Docusaurus clean URLs redirect index.html to a slashless path. Pin the base so
// the renderer's ../assets and demo bridge scripts still resolve under /product-window/.
html = html.replace('<head>', '<head>\n  <base href="/product-window/react/">');
html = html.replace(
  /<meta http-equiv="Content-Security-Policy"[^>]*>/,
  '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: blob:; font-src \'self\' data:; connect-src \'self\'; media-src \'self\' data: blob:; worker-src \'self\' blob:; object-src \'none\'; base-uri \'self\'">',
);
html = html.replace('<body>', '<body>\n  <script src="../demo-data/file-icon-test.js?v=5"></script>\n  <script src="../demo-data/subagent-work.js?v=1"></script>\n  <script src="../demo-data/moments.js?v=3"></script>\n  <script src="../demo-workspace-manifest.js?v=1"></script>\n  <script src="../preview-bridge.js?v=12"></script>');
writeFileSync(htmlPath, html);

console.log(`预览资源已同步到 ${targetRoot}`);

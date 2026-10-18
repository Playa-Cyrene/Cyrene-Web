import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import tailwindcss from '@tailwindcss/postcss';
import {LATEST_RELEASE_API, normalizeRelease, type ReleaseInfo} from './src/lib/latest-release';
import releaseFallback from './src/data/latest-release.fallback.json';

/**
 * 构建时读取 GitHub 最新正式版，写入全局数据供下载页渲染。
 * 构建机拿不到时（离线、超时、额度用完）退回仓库里的快照，不让构建失败；
 * 设置 GITHUB_TOKEN 环境变量可避开未登录 API 的 60 次/小时限制。
 */
async function loadLatestRelease(): Promise<ReleaseInfo> {
  const fallback = releaseFallback as ReleaseInfo;
  try {
    const headers: Record<string, string> = {Accept: 'application/vnd.github+json', 'User-Agent': 'cyrene-web-build'};
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch(LATEST_RELEASE_API, {headers, signal: AbortSignal.timeout(10_000)});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const release = normalizeRelease(await response.json());
    if (!release) throw new Error('no valid release in response');
    return release;
  } catch (error) {
    console.warn(`[cyrene-latest-release] 使用快照 v${fallback.version}：${error instanceof Error ? error.message : String(error)}`);
    return fallback;
  }
}

const config: Config = {
  title: 'Cyrene',
  tagline: '让昔涟陪你聊天、工作、编程与学习',
  favicon: 'img/logo.png',
  url: process.env.SITE_URL ?? 'https://cyrene-agent.example',
  baseUrl: '/',
  organizationName: 'Playa-Cyrene',
  projectName: 'Cyrene-Agent',
  onBrokenLinks: 'throw',
  i18n: {defaultLocale: 'zh-Hans', locales: ['zh-Hans']},
  plugins: [
    function latestReleasePlugin() {
      return {
        name: 'cyrene-latest-release',
        loadContent: loadLatestRelease,
        async contentLoaded({content, actions}) {
          actions.setGlobalData(content);
        },
      };
    },
    function tailwindPlugin() {
      return {
        name: 'cyrene-tailwind',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(tailwindcss());
          return postcssOptions;
        },
      };
    },
  ],
  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: 'img/logo.png',
    colorMode: {defaultMode: 'light', respectPrefersColorScheme: false, disableSwitch: false},
    navbar: {
      title: 'Cyrene',
      logo: {alt: 'Cyrene', src: 'img/logo.png'},
      items: [
        {label: '产品演示', href: '/#demo', position: 'left', className: 'cyrene-nav-item'},
        {label: '功能', href: '/#features', position: 'left', className: 'cyrene-nav-item'},
        {label: '文档', href: 'https://github.com/Playa-Cyrene/Cyrene-Agent/tree/master/docs', position: 'left', className: 'cyrene-nav-item'},
        {label: '公告', href: '/announcements', position: 'left', className: 'cyrene-nav-item'},
        {label: '免责声明', href: '/disclaimer', position: 'left', className: 'cyrene-nav-item'},
        {label: 'GitHub', href: 'https://github.com/Playa-Cyrene/Cyrene-Agent', position: 'right', className: 'cyrene-nav-github'},
        {label: '下载 Cyrene', href: '/download', position: 'right', className: 'cyrene-nav-cta', 'aria-label': '下载 Cyrene', title: '下载 Cyrene'},
      ],
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  } satisfies Preset.ThemeConfig,
};

export default config;

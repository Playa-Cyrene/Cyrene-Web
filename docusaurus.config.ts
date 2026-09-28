import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import tailwindcss from '@tailwindcss/postcss';

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

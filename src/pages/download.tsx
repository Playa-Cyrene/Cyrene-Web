import Layout from '@theme/Layout';
import {ArrowUpRight, CloudDownload, Download, PackageOpen} from 'lucide-react';
import './download.css';

const downloads = [
  {
    name: 'GitHub Releases',
    eyebrow: '项目发布页',
    description: '查看 Cyrene 的 GitHub Releases 页面与公开发布包。',
    href: 'https://github.com/Playa-Cyrene/Cyrene-Agent/releases',
    action: '前往 GitHub Releases',
    icon: Download,
    className: 'github',
  },
  {
    name: '夸克网盘',
    eyebrow: '网盘下载',
    description: '通过夸克网盘获取 Cyrene v1.3.0。',
    href: 'https://pan.quark.cn/s/338de1846636',
    action: '打开夸克网盘',
    icon: CloudDownload,
    className: 'quark',
  },
];

export default function DownloadPage() {
  return (
    <Layout title="下载 Cyrene v1.3.0" description="下载 Cyrene v1.3.0 正式版。">
      <main className="cyrene-download-page">
        <section className="cyrene-download-hero" aria-labelledby="cyrene-download-title">
          <span className="cyrene-download-version"><PackageOpen size={14} aria-hidden="true" /> 正式版 · v1.3.0</span>
          <h1 id="cyrene-download-title">下载 Cyrene</h1>
          <p>选择一个下载方式，开始让昔涟生活在你的电脑上。</p>
        </section>

        <section className="cyrene-download-options" aria-label="Cyrene v1.3.0 下载方式">
          {downloads.map(({name, eyebrow, description, href, action, icon: Icon, className}) => (
            <article className={`cyrene-download-card is-${className}`} key={name}>
              <div className="cyrene-download-card__topline">
                <span className="cyrene-download-card__icon"><Icon size={20} strokeWidth={1.8} aria-hidden="true" /></span>
                <span className="cyrene-download-card__eyebrow">{eyebrow}</span>
              </div>
              <h2>{name}</h2>
              <p>{description}</p>
              <a className="cyrene-download-card__action" href={href} target="_blank" rel="noreferrer">
                {action} <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </article>
          ))}
        </section>
      </main>
    </Layout>
  );
}

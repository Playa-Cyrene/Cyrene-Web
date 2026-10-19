import Layout from '@theme/Layout';
import {usePluginData} from '@docusaurus/useGlobalData';
import {ArrowUpRight, CloudDownload, Download, PackageOpen} from 'lucide-react';
import {compareVersions, formatDate, formatSize, type ReleaseInfo} from '../lib/latest-release';
import {useLatestRelease} from '../lib/use-latest-release';
import './download.css';

// 夸克网盘链接需手动维护，GitHub 无法得知网盘里是哪个版本；更新网盘文件后同步修改这里。
const QUARK_URL = 'https://pan.quark.cn/s/e87dba6a03d3';
const QUARK_VERSION = '1.3.4';

export default function DownloadPage() {
  const buildRelease = usePluginData('cyrene-latest-release') as ReleaseInfo;
  const release = useLatestRelease(buildRelease);
  const {version, installer, htmlUrl} = release;
  const publishedOn = formatDate(release.publishedAt);
  const installerSize = installer ? formatSize(installer.size) : '';
  const quarkIsOlder = compareVersions(QUARK_VERSION, version) < 0;

  return (
    <Layout title={`下载 Cyrene v${version}`} description={`下载 Cyrene v${version} 正式版。`}>
      <main className="cyrene-download-page">
        <section className="cyrene-download-hero" aria-labelledby="cyrene-download-title">
          <span className="cyrene-download-version">
            <PackageOpen size={14} aria-hidden="true" /> 正式版 · v{version}{publishedOn && ` · ${publishedOn} 发布`}
          </span>
          <h1 id="cyrene-download-title">下载 Cyrene</h1>
          <p>选择一个下载方式，开始让昔涟生活在你的电脑上。</p>
        </section>

        <section className="cyrene-download-options" aria-label={`Cyrene v${version} 下载方式`}>
          <article className="cyrene-download-card is-github">
            <div className="cyrene-download-card__topline">
              <span className="cyrene-download-card__icon"><Download size={20} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className="cyrene-download-card__eyebrow">GitHub Releases</span>
            </div>
            <h2>Windows 安装包</h2>
            <p>
              {installer
                ? <>直接下载 v{version} 安装程序<span className="cyrene-download-card__meta">{installer.name}{installerSize && ` · ${installerSize}`}</span></>
                : `查看 Cyrene v${version} 的发布说明与安装包。`}
            </p>
            <div className="cyrene-download-card__actions">
              <a className="cyrene-download-card__action" href={installer?.url ?? htmlUrl} target="_blank" rel="noreferrer">
                {installer ? `下载 v${version}` : '前往 GitHub Releases'} <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              {installer && (
                <a className="cyrene-download-card__secondary" href={htmlUrl} target="_blank" rel="noreferrer">
                  发布说明与其他安装包
                </a>
              )}
            </div>
          </article>

          <article className="cyrene-download-card is-quark">
            <div className="cyrene-download-card__topline">
              <span className="cyrene-download-card__icon"><CloudDownload size={20} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className="cyrene-download-card__eyebrow">网盘下载</span>
            </div>
            <h2>夸克网盘</h2>
            <p>
              通过夸克网盘获取 Cyrene v{QUARK_VERSION}。
              {quarkIsOlder && <span className="cyrene-download-card__meta">网盘版本不是最新，最新版 v{version} 请从 GitHub 下载。</span>}
            </p>
            <div className="cyrene-download-card__actions">
              <a className="cyrene-download-card__action" href={QUARK_URL} target="_blank" rel="noreferrer">
                打开夸克网盘 <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </article>
        </section>
      </main>
    </Layout>
  );
}

import {
  ArrowUpRight,
  BookOpen,
  Mail,
} from 'lucide-react';
import type {ReactNode} from 'react';
import Bilibili from '@lobehub/icons/es/Bilibili';
import './site-footer.css';

const links = {
  github: 'https://github.com/Playa-Cyrene/Cyrene-Agent',
  gitee: 'https://gitee.com/playa0/cyrene-agent',
  releases: '/download',
  docs: 'https://github.com/Playa-Cyrene/Cyrene-Agent/tree/master/docs',
  guide: 'https://github.com/Playa-Cyrene/Cyrene-Agent/tree/master/docs/user-guide',
  issues: 'https://github.com/Playa-Cyrene/Cyrene-Agent/issues',
  bilibili: 'https://space.bilibili.com/260670644',
  email: 'mailto:ky2569ly@gmail.com',
};

function GithubBrandIcon({size = 15}: {size?: number}) {
  return (
    <svg className="cyrene-footer-brand-github" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.335-5.467-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 6.008 0c2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.605-.015 2.897-.015 3.293 0 .32.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function GiteeBrandIcon({size = 15}: {size?: number}) {
  return (
    <svg className="cyrene-footer-brand-gitee" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z" />
    </svg>
  );
}

function FooterLink({
  href,
  icon,
  children,
  external = true,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a className="cyrene-footer-link" href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      {icon}
      <span>{children}</span>
      {external && <ArrowUpRight className="cyrene-footer-link-arrow" size={12} aria-hidden="true" />}
    </a>
  );
}

export default function SiteFooter() {
  return (
    <footer className="cyrene-site-footer" id="footer">
      <section className="cyrene-footer-cta" aria-labelledby="cyrene-footer-title">
        <img className="cyrene-footer-cta-logo" src="/img/logo.png" alt="" />
        <p className="cyrene-footer-eyebrow">让陪伴与创造，都在桌面发生</p>
        <h2 id="cyrene-footer-title">让昔涟生活在你的电脑上</h2>
        <a className="cyrene-footer-download" href={links.releases}>
          获取桌面版 <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </section>

      <div className="cyrene-footer-main">
        <div className="cyrene-footer-grid">
          <div className="cyrene-footer-brand">
            <a className="cyrene-footer-brand-name" href="#top" aria-label="昔涟 Cyrene，返回顶部">
              <img src="/img/logo.png" alt="" />
              <span>昔涟 <i>|</i> Cyrene</span>
            </a>
            <p>一个住在桌面上的 AI 伙伴。</p>
          </div>

          <nav className="cyrene-footer-column" aria-label="仓库地址">
            <h3>仓库地址</h3>
            <FooterLink href={links.github} icon={<GithubBrandIcon />}>GitHub 地址</FooterLink>
            <FooterLink href={links.gitee} icon={<GiteeBrandIcon />}>Gitee 地址</FooterLink>
          </nav>

          <nav className="cyrene-footer-column" aria-label="文档">
            <h3>文档</h3>
            <FooterLink href={links.docs} icon={<BookOpen size={15} strokeWidth={1.8} aria-hidden="true" />}>项目文档</FooterLink>
            <FooterLink href={links.guide} icon={<BookOpen size={15} strokeWidth={1.8} aria-hidden="true" />}>使用指南</FooterLink>
            <FooterLink href={links.releases} icon={<ArrowUpRight size={15} aria-hidden="true" />} external={false}>版本与下载</FooterLink>
          </nav>

          <nav className="cyrene-footer-column" aria-label="视频动态">
            <h3>视频动态</h3>
            <FooterLink href={links.bilibili} icon={<Bilibili className="cyrene-footer-brand-bilibili" size={15} />}>B 站动态</FooterLink>
          </nav>

          <nav className="cyrene-footer-column" aria-label="联系方式">
            <h3>联系方式</h3>
            <FooterLink href={links.issues} icon={<GithubBrandIcon />}>GitHub Issue 页</FooterLink>
            <FooterLink href={links.email} icon={<Mail size={15} strokeWidth={1.8} aria-hidden="true" />} external={false}>邮箱</FooterLink>
          </nav>
        </div>

        <div className="cyrene-footer-bottom">
          <span>让想法落地，也让昔涟常伴身边。</span>
          <span>© {new Date().getFullYear()} Cyrene Agent</span>
        </div>
      </div>
    </footer>
  );
}

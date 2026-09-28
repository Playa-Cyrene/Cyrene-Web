import {ArrowUpRight, CircleHelp, Mail, Sparkles} from 'lucide-react';
import './announcement.css';

const downloadUrl = '/download';
const issueUrl = 'https://github.com/Playa-Cyrene/Cyrene-Agent/issues';
const bilibiliUrl = 'https://space.bilibili.com/260670644';
const emailUrl = 'mailto:ky2569ly@gmail.com';

const abilities = [
  '读写本地文件',
  '执行命令',
  '搜索和整理资料',
  '完成桌面任务',
  '像朋友一样陪你聊天',
];

export default function Announcement() {
  return (
    <section className="cyrene-announcement" id="updates" aria-labelledby="cyrene-announcement-title">
      <div className="cyrene-announcement__inner">
        <div className="cyrene-announcement__meta">
          <span className="cyrene-announcement__badge"><Sparkles size={13} aria-hidden="true" /> 最新公告</span>
          <time dateTime="2026-09-28">2026 年 9 月 28 日</time>
        </div>

        <article className="cyrene-announcement__card">
          <header className="cyrene-announcement__header">
            <span className="cyrene-announcement__version">正式版 · v1.3.0</span>
            <h2 id="cyrene-announcement-title">Cyrene 正式版现已发布 <span aria-hidden="true">🎉</span></h2>
            <p>欢迎使用 <strong>Cyrene</strong> —— 一款<strong>开源、免费</strong>的桌面 AI Agent 助手。</p>
          </header>

          <div className="cyrene-announcement__body">
            <p className="cyrene-announcement__intro">它可以帮你处理日常任务，也可以像朋友一样陪你聊天：</p>
            <ul className="cyrene-announcement__abilities">
              {abilities.map((ability) => <li key={ability}>{ability}</li>)}
            </ul>

            <p className="cyrene-announcement__highlight">不需要学习复杂的操作方式，<strong>想做什么，直接告诉 Cyrene 即可。</strong></p>

            <div className="cyrene-announcement__links">
              <a href={bilibiliUrl} target="_blank" rel="noreferrer">B 站使用教程 <ArrowUpRight size={14} aria-hidden="true" /></a>
              <a href={downloadUrl}>获取 Cyrene v1.3.0 <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>

            <a className="cyrene-announcement__notice" href="/disclaimer">
              <h3>使用前请留意</h3>
              <p>使用本软件即代表你已阅读、理解并同意相关免责声明及使用条款。</p>
              <span className="cyrene-announcement__notice-link">查看完整免责声明 <ArrowUpRight size={13} aria-hidden="true" /></span>
            </a>

            <div className="cyrene-announcement__feedback">
              <div>
                <h3>问题反馈与支持</h3>
                <p>遇到 Bug 或其他问题，可点击应用内的「问题报告」，按模板通过邮件或 GitHub Issue 反馈。</p>
                <p>Cyrene 由 <strong>Playa 个人独立完成全栈开发</strong>。如果它对你有帮助，欢迎到 GitHub 给项目点一个 Star。你的支持和反馈对项目很重要，谢谢！</p>
              </div>
              <div className="cyrene-announcement__feedback-links">
                <a href={issueUrl} target="_blank" rel="noreferrer"><CircleHelp size={15} aria-hidden="true" /> GitHub Issue</a>
                <a href={emailUrl}><Mail size={15} aria-hidden="true" /> 邮件反馈</a>
              </div>
            </div>
          </div>

          <footer className="cyrene-announcement__footer">
            <span>Cyrene v1.3.0，欢迎体验。</span>
            <a href="https://github.com/Playa-Cyrene/Cyrene-Agent" target="_blank" rel="noreferrer">前往 GitHub 点亮 Star <ArrowUpRight size={14} aria-hidden="true" /></a>
          </footer>
        </article>
      </div>
    </section>
  );
}

import {ArrowUpRight, ShieldCheck, Sparkles, Wrench} from 'lucide-react';
import './release-notes.css';

// 内容取自 GitHub Release v1.3.5 的中文说明：https://github.com/Playa-Cyrene/Cyrene-Agent/releases/tag/v1.3.5
const version = 'v1.3.5';
const publishedAt = '2026-11-01';
const releaseUrl = 'https://github.com/Playa-Cyrene/Cyrene-Agent/releases/tag/v1.3.5';
const compareUrl = 'https://github.com/Playa-Cyrene/Cyrene-Agent/compare/v1.3.4...v1.3.5';

const chapters = [
  {
    icon: Sparkles,
    title: '新增与改进',
    items: [
      '新增 GPT-6.1 Terra、Kimi K3.1 Pro / Pro Highspeed、MiniMax M3.1 Flash 模型适配，更新推理强度与结构化输出规则。MiniMax Preview 名称继续兼容已有配置，不会自动改写保存的型号',
      '内置浏览器新增自动显示模式：浏览器宽度窄使用移动端身份，宽时恢复桌面身份',
      '通用设置现在显示用户数据目录，并支持复制路径和打开文件夹',
      '代码字体随应用打包，防止因无法连接 Google Fonts 导致启动超时',
    ],
  },
  {
    icon: ShieldCheck,
    title: '升级与兼容性',
    items: [
      '浏览器自动显示模式为默认行为。网站需要固定桌面身份时可选择「自定义」',
      'GPT-6.1 Sol 不再接受关闭思考',
      '本地模型缺 tokenizer_config.json 时会显示不完整，需要补齐文件',
      '同时只运行一个 Learn 会话，其他 Learn 请求遇到忙碌后需等待并重试',
    ],
  },
  {
    icon: Wrench,
    title: '修复',
    wide: true,
    items: [
      '修复了空闲续跑、退出保存、失败重试与重新注册时的结果丢失。取消、删除、工作区切换和历史回退会限制旧结果投递，后台不会自动批准需要用户确认的操作',
      '学习会话现在不会因为共享 Vault 导致配置互相覆盖，异步进度固定写回发起时的 Vault，忙碌/拒绝状态持久化',
      '主动消息现在使用与 Chat 一致的模型档案',
      '改进了上下文计算方式，防止上下文计算比实际少导致上下文溢出',
      'jieba 按需加载。初始化失败时记录诊断并降级防止启动失败，后续调用时重试',
      '定时任务重启后保留 Work / Code 模式',
      '修复打包运行环境中的 ExcelJS 动态导入。PDF 正确选择中文 TTC 字体并尝试后续可用字体，生成完成前不截断原文件。临时输出不再依赖目标目录写权限',
    ],
  },
];

export default function LatestReleaseNotes() {
  return (
    <section className="cyrene-release-notes" id="latest" aria-labelledby="cyrene-latest-release-title">
      <div className="cyrene-release-notes__inner">
        <div className="cyrene-release-notes__eyebrow">
          <span /> 最新版本 · {version} · <time dateTime={publishedAt}>2026 年 11 月 1 日</time>
        </div>
        <header className="cyrene-release-notes__header">
          <div>
            <h2 id="cyrene-latest-release-title">Cyrene {version} 已发布</h2>
            <p>本次更新没有新增功能。主要包含模型配置、后台调度、启动优化、一些后端改进和 bug 修复。</p>
          </div>
          <a className="cyrene-release-notes__jump" href={releaseUrl} target="_blank" rel="noreferrer">
            GitHub 发布页 <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </header>

        <div className="cyrene-release-notes__chapters">
          {chapters.map(({icon: Icon, title, items, wide}, index) => (
            <article className={`cyrene-release-notes__chapter${wide ? ' cyrene-release-notes__chapter--wide' : ''}`} key={title}>
              <div className="cyrene-release-notes__chapter-top">
                <span className="cyrene-release-notes__chapter-icon"><Icon size={17} aria-hidden="true" /></span>
                <span className="cyrene-release-notes__chapter-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3>{title}</h3>
              <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>

        <footer className="cyrene-release-notes__closing">
          <p>自动更新：应用内会推送 1.3.5，支持差分更新，只需下载有变化的部分。手动安装：Cyrene-Setup-1.3.5.exe（约 500 MB），可在<a href="/download">下载页</a>获取。</p>
          <p>提示：安装包未做代码签名，Windows 可能弹出 SmartScreen 提示，选择「更多信息 → 仍要运行」即可。</p>
          <strong><a href={compareUrl} target="_blank" rel="noreferrer">完整源码比较 v1.3.4…v1.3.5 <ArrowUpRight size={13} aria-hidden="true" /></a></strong>
        </footer>
      </div>
    </section>
  );
}

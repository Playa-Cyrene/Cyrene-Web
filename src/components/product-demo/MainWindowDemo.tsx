import {useState} from 'react';
import {ArrowUpRight, Monitor, MousePointerClick, ShieldCheck, Sparkles} from 'lucide-react';
import './main-window-demo.css';

export default function MainWindowDemo() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="cy-demo-section" id="demo" aria-label="Cyrene 桌面窗口演示">
      <div className="cy-demo-heading">
        <span className="cy-demo-eyebrow"><Sparkles size={13} aria-hidden="true" /> 桌面端真实界面</span>
        <h2>先在这里，逛逛 Cyrene。</h2>
        <p>下方直接运行 Cyrene 桌面端的同一套界面代码。你可以试发消息，看到固定的演示回复；内容只保存在当前页面。</p>
      </div>

      <div className="cy-demo-frame-shell">
        {!loaded && <div className="cy-demo-loading" aria-live="polite">正在载入 Cyrene 界面…</div>}
        <iframe
          className={`cy-demo-frame ${loaded ? 'is-ready' : ''}`}
          title="Cyrene 桌面端交互预览"
          src="/product-window/react/index.html?demo=1&preview=chat-v1"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          allow="clipboard-read; clipboard-write"
        />
      </div>

      <div className="cy-demo-notes">
        <span><MousePointerClick size={14} aria-hidden="true" />可浏览并试发消息</span>
        <span><Monitor size={14} aria-hidden="true" />消息只保存在当前页面</span>
        <span><ShieldCheck size={14} aria-hidden="true" />固定演示回复，不调用模型</span>
        <a href="https://github.com/Playa-Cyrene/Cyrene-Agent" target="_blank" rel="noreferrer">
          查看桌面项目 <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

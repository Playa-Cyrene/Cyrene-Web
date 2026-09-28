import {ArrowDown, Blocks, Bot, FileCode2, Gauge, Headphones, Layers3, MessageSquareText, Settings2, ShieldCheck} from 'lucide-react';
import './release-notes.css';

const chapters = [
  {
    icon: Layers3,
    title: '首个稳定版，完成核心架构梳理',
    description: 'v1.3.0 是 Cyrene 自 v0.1.0 以来的首个稳定版（Stable Release，稳定版）。项目累计近 1800 次提交；从 v1.2.2 到 v1.3.0 又完成了 300 多次提交。版本号沿用现有序列，保持历史与升级链路连续。',
    items: ['重新梳理聊天、会话、智能体（Agent）、插件、设置、窗口、文件、计划模式、模型与运行时等核心模块', '发布阶段从快速迭代与预览转入稳定演进，更重视兼容性、数据可靠性与长期维护'],
  },
  {
    icon: Blocks,
    title: '插件市场与扩展能力',
    description: '插件从安装流程到来源管理均得到完善，社区扩展能力进一步增强。',
    items: ['新增插件市场服务与安装流程，支持 GitHub、Gitee 双源及手动切换', '增加来源与版本校验、插件详情，以及无界面插件支持', '完善插件设置面板、安装身份与市场来源记录；插件开发工具包（Plugin SDK）进入新的发布阶段'],
  },
  {
    icon: MessageSquareText,
    title: '会话记录与聊天体验',
    description: '对话轨迹、持久化和上下文管理经过重构，让长对话与任务恢复更加可靠。',
    items: ['增加会话迁移与恢复、持久化轨迹、压缩检查点、上下文自动压缩和进度提示', '改进 Markdown（轻量标记语言）与数学公式显示，支持文件拖放、粘贴、路径复制、本机打开和资源管理器定位', '增加文件类型图标、网站链接卡片、最近项目切换、会话搜索、侧栏排序、命令实时输出与回复时间', '完善未读状态、错误分类和错误详情，并恢复聊天内容的右键操作与文本选择'],
  },
  {
    icon: Bot,
    title: '模型切换、计划模式与智能体工作流',
    description: '模型控制下沉到会话，复杂任务的计划、审批和子任务管理更加清晰。',
    items: ['支持对话级模型切换、模型档案管理、推理档位控制与 Token（模型词元）用量查看', '扩展 GPT-6 Sol / Luna、DeepSeek V4.1 Flash、MiMo V2.6 等模型配置', '计划模式支持状态持久化与崩溃恢复、分档审批、审批预览及意见回传', '完善子任务访问模式、并行数量、会话详情、角色与模型配置'],
  },
  {
    icon: Settings2,
    title: 'MCP（模型上下文协议）与统一设置中心',
    description: '设置入口逐步收敛，模型、插件、工具与外部连接可以在更一致的界面中管理。',
    items: ['新增 MCP（模型上下文协议）服务管理，支持服务增删、远程接入、文件系统配置与推荐模板', '整合模型、插件、技能与工具入口，以及模型档案、用户资料、头像和自定义角色头像', '完善外部渠道配置与未保存修改提醒'],
  },
  {
    icon: ShieldCheck,
    title: '定时任务、提醒与外部渠道可靠性',
    description: '从即时任务到后台任务，执行状态和提醒方式更加完整。',
    items: ['新增定时调度、任务持久化与执行器，并提供聊天页任务面板和设置页管理', '新增独立提醒中心，支持等待操作与任务完成提醒、焦点抑制、超时、音效及全局开关', '改进外部渠道的消息顺序、鉴权、发送状态、限速、回执和统一会话记录', '增加消息重放去重，并修复微信 Long Poll（长轮询）退出阻塞问题'],
  },
  {
    icon: Headphones,
    title: '语音、文件与工作区',
    description: '加强桌面工作流，同时让语音交互更及时、渠道选择更统一。',
    items: ['新增 MiniMax 语音识别并统一语音服务选择；语音合成支持流式切句、提前合成', '重构 Live2D 口型同步、说话动效与眨眼逻辑，整理通话窗口入口', '优化工作区绑定和切换；切换工作区时创建新会话，并支持打开工作区外的绝对路径文件', '改进文件树、右键菜单、最近项目、首次 Git Push（推送）及冲突保护'],
  },
  {
    icon: FileCode2,
    title: '界面、窗口与应用更新',
    description: '统一视觉与窗口行为，并让升级入口更容易找到。',
    items: ['迁移 Mantine Provider（组件库上下文提供器）与 Design Token（设计变量），适配 Ant Design v6（前端界面组件库），统一系统字体、主题色与暗色模式', '改进设置页、欢迎页、用户菜单和资料卡；记住主窗口位置与尺寸', '整理侧栏抽屉、右侧集成开发环境式布局与旧窗口，统一窗口状态持久化', '启用差分更新包并校验更新产物；应用内更新入口集中到设置页和用户菜单'],
  },
  {
    icon: Gauge,
    title: '检索性能与工程稳定性',
    description: '围绕检索、渲染和状态一致性做了底层优化，为后续稳定更新打基础。',
    items: ['调整 RAG（检索增强生成）为全量余弦扫描，改进异步落盘、BM25（文本相关性排序算法）分词缓存、分片预热和批量 Embedding（嵌入向量）推理', '增加聊天渲染性能基线与录制工具，并优化多处界面渲染路径', '升级 Electron（桌面应用框架）、Vite（前端构建工具）、TypeScript（JavaScript 类型系统）6.0 与 Vitest（前端测试框架）5；拆分并加固 CI（持续集成）流程', '修复多项竞态、持久化、恢复、状态一致性与 Windows 页面导航问题'],
  },
];

export default function ReleaseNotes() {
  return (
    <section className="cyrene-release-notes" aria-labelledby="cyrene-release-notes-title">
      <div className="cyrene-release-notes__inner">
        <div className="cyrene-release-notes__eyebrow"><span /> 更新说明 · v1.3.0</div>
        <header className="cyrene-release-notes__header">
          <div>
            <h2 id="cyrene-release-notes-title">从快速迭代，迈入稳定演进。</h2>
            <p>这次更新不仅带来新功能，也重新打磨了会话、工作流、插件和桌面运行基础。</p>
          </div>
          <a className="cyrene-release-notes__jump" href="#cyrene-release-details">查看更新内容 <ArrowDown size={15} aria-hidden="true" /></a>
        </header>

        <div className="cyrene-release-notes__stats" aria-label="版本概览">
          <div><strong>近 1800</strong><span>累计提交</span></div>
          <div><strong>300+</strong><span>v1.2.2 至 v1.3.0 提交</span></div>
          <div><strong>首个稳定版</strong><span>Stable Release（稳定版）</span></div>
        </div>

        <div className="cyrene-release-notes__chapters" id="cyrene-release-details">
          {chapters.map(({icon: Icon, title, description, items}, index) => (
            <article className="cyrene-release-notes__chapter" key={title}>
              <div className="cyrene-release-notes__chapter-top">
                <span className="cyrene-release-notes__chapter-icon"><Icon size={17} aria-hidden="true" /></span>
                <span className="cyrene-release-notes__chapter-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>

        <footer className="cyrene-release-notes__closing">
          <p>v1.3.0 不是终点，而是 Cyrene 稳定演进的新起点。接下来，项目会继续关注兼容性、数据与状态可靠性、升级体验、插件生态和长期维护。</p>
          <strong>感谢每一位使用、测试、反馈和参与 Cyrene 的人。</strong>
        </footer>
      </div>
    </section>
  );
}

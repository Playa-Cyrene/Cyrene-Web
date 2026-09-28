import './feature-showcase.css';

const features = [
  {
    number: '01',
    title: '空间动态',
    description: '查看昔涟与伙伴们分享的动态，也可以点赞、评论，在对话之外继续交流。',
    darkImage: '/img/features/space-updates-dark.png',
    lightImage: '/img/features/space-updates-light.png',
  },
  {
    number: '02',
    title: '移动端渠道',
    description: '通过移动端消息渠道与 Cyrene 互动，把熟悉的对话入口带在身边。',
    darkImage: '/img/features/mobile-channels-dark.png',
    lightImage: '/img/features/mobile-channels-light.png',
  },
  {
    number: '03',
    title: '语音通话',
    description: '用语音和昔涟交流，让提问、陪伴和灵感记录都更自然。',
    darkImage: '/img/features/voice-call-dark.png',
    lightImage: '/img/features/voice-call-light.png',
  },
  {
    number: '04',
    title: 'MCP（模型上下文协议）',
    description: '连接兼容 MCP 的服务与工具，把更多外部能力带进 Cyrene 的工作流程。',
    darkImage: '/img/features/mcp-dark.png',
    lightImage: '/img/features/mcp-light.png',
  },
  {
    number: '05',
    title: '插件社区',
    description: '浏览社区插件，为 Cyrene 扩展新的工具与使用方式。',
    darkImage: '/img/features/plugin-community-dark.png',
    lightImage: '/img/features/plugin-community-light.png',
  },
];

export default function FeatureShowcase() {
  return (
    <section className="cyrene-feature-showcase" id="features" aria-labelledby="cyrene-feature-title">
      <header className="cyrene-feature-showcase__heading">
        <span className="cyrene-feature-showcase__eyebrow">功能展示</span>
        <h2 id="cyrene-feature-title">不止对话，也能做更多。</h2>
        <p>从日常互动到能力扩展，看看 Cyrene 如何融入你的工作与生活。</p>
      </header>

      <div className="cyrene-feature-showcase__list">
        {features.map(({number, title, description, darkImage, lightImage}, index) => (
          <article
            className={`cyrene-feature-showcase__row${index % 2 === 1 ? ' is-reversed' : ''}`}
            key={number}>
            <div className="cyrene-feature-showcase__copy">
              <span className="cyrene-feature-showcase__number">{number} / 05</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            <picture className="cyrene-feature-showcase__visual">
              <img
                className="cyrene-feature-showcase__image is-dark"
                src={darkImage}
                alt={`${title}界面暗色主题截图`}
                loading="lazy"
              />
              <img
                className="cyrene-feature-showcase__image is-light"
                src={lightImage}
                alt={`${title}界面浅色主题截图`}
                loading="lazy"
              />
            </picture>
          </article>
        ))}
      </div>
    </section>
  );
}

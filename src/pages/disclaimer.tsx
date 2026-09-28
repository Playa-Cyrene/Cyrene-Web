import Layout from '@theme/Layout';
import {ArrowLeft, ArrowUpRight, ShieldCheck} from 'lucide-react';
import type {ReactNode} from 'react';
import './disclaimer.css';

const github = 'https://github.com/Playa-0v0/Cyrene-Agent';
const githubIssues = `${github}/issues`;
const email = 'mailto:ky2569ly@gmail.com';
const bilibili = 'https://space.bilibili.com/260670644';

function ExternalLink({href, children}: {href: string; children: ReactNode}) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children} <ArrowUpRight size={12} aria-hidden="true" /></a>;
}

export default function DisclaimerPage() {
  return (
    <Layout title="免责声明与使用条款" description="Cyrene 项目的免责声明与使用条款。">
      <main className="cyrene-disclaimer-page">
        <div className="cyrene-disclaimer-wrap">
          <a className="cyrene-disclaimer-back" href="/announcements"><ArrowLeft size={14} aria-hidden="true" /> 返回公告</a>

          <header className="cyrene-disclaimer-hero">
            <span className="cyrene-disclaimer-label"><ShieldCheck size={14} aria-hidden="true" /> 使用前请留意</span>
            <h1>免责声明与使用条款</h1>
            <p>使用本软件前，请阅读并理解以下条款。</p>
          </header>

          <article className="cyrene-disclaimer-content">
            <section>
              <h2>1. 项目性质与版权声明</h2>
              <p>本 AI 陪伴程序为个人粉丝非商用同人项目，“昔涟”角色人设取材于米哈游（miHoYo）旗下游戏《崩坏：星穹铁道》。角色名称、世界观、原画、官方文案等全部知识产权及著作权均归属米哈游。</p>
              <p>本项目无官方授权，不属于官方软件，双方不存在任何合作关系。</p>
            </section>

            <section>
              <h2>2. 使用范围与第三方内容</h2>
              <p>本项目原创源代码依 MIT License 授权。该许可不适用于“昔涟”及《崩坏：星穹铁道》相关的角色、形象、设定、图像、音频、文本、商标等第三方内容。</p>
              <p>本项目不授予上述第三方内容的商业使用权或再许可权。涉及相关内容的复制、传播、公开展示、直播、收费服务、商业推广等行为，用户应自行遵守原权利人的授权政策及适用法律法规，并自行承担相应责任。</p>
            </section>

            <section>
              <h2>3. 用户责任</h2>
              <p>用户与 AI 产生的对话内容，责任由使用者自行承担。</p>
              <p>不得使用本软件发布违法、低俗、造谣、恶意抹黑原作 IP、违背公序良俗的内容；违规后果由用户自行承担，开发者不承担任何连带责任。</p>
            </section>

            <section>
              <h2>4. 项目无担保声明</h2>
              <p>本项目为实验性开源项目，不保障程序稳定性。因程序漏洞、硬件故障、本地聊天数据丢失等产生的任何损失，开发者不予赔付。</p>
              <p>本软件按“原样”提供，不附带任何明示或默示的担保。</p>
            </section>

            <section>
              <h2>5. 昔涟角色版权与语音克隆工具</h2>
              <p>本软件不分发《崩坏：星穹铁道》昔涟的官方语音素材。软件仅提供 TTS 语音克隆工具，<strong>使用者必须使用已获得合法授权的音频进行克隆</strong>。利用本工具生成内容带来的全部版权、法律责任，均由使用者自行承担，和本软件作者无关。昔涟角色版权归属米哈游，对应配音声音权益归各国配音演员所有。</p>
            </section>

            <section>
              <h2>6. 版权方联络通道</h2>
              <p>若米哈游 / HoYoverse 权利方认为本软件存在侵犯权益的情形，请通过以下方式联系，作者承诺在收到通知后 7 个工作日内积极配合处理或下架。</p>
              <ul>
                <li>电子邮箱：<ExternalLink href={email}>ky2569ly@gmail.com</ExternalLink>（邮件标题请注明【版权事宜】）</li>
                <li>B站：<ExternalLink href={bilibili}>Playa0 作者空间</ExternalLink>（私信请注明【版权联络】）</li>
                <li>GitHub：<ExternalLink href={github}>Playa-0v0/Cyrene-Agent</ExternalLink></li>
              </ul>
            </section>

            <section>
              <h2>7. 用户反馈与 Bug 提交</h2>
              <p>如您遇到问题、Bug 或有功能建议，欢迎通过以下渠道提交。</p>
              <ul>
                <li>发送邮件至 <ExternalLink href={email}>ky2569ly@gmail.com</ExternalLink>（标题建议带【反馈】或【Bug】）</li>
                <li>B站私信 <ExternalLink href={bilibili}>Playa0</ExternalLink>（开头注明【反馈/Bug】）</li>
                <li><ExternalLink href={githubIssues}>GitHub Issues</ExternalLink>（提交 Bug / 功能建议）</li>
              </ul>
              <p>普通用户反馈我会尽力查看，但不保证及时回复；版权事宜享有最高响应优先级。</p>
            </section>

            <section>
              <h2>8. AI 生成内容与使用心态提醒</h2>
              <p>本软件中所有 AI 角色的对话、回应及行为均由大语言模型实时生成，角色人设和性格为虚构设定，并非真实个体。AI 的输出不具备真实情感、自我意识或主观意图。</p>
              <p>请注意：</p>
              <ul>
                <li>所有对话内容均为 AI 生成，不代表任何真实个体的观点或情感。</li>
                <li>本软件为娱乐性质的辅助工具，不可替代真实的社交关系、亲情、友情或专业心理咨询。</li>
                <li>请勿对 AI 角色产生情感依赖，或将虚拟互动视为现实人际关系的替代品。</li>
                <li>建议您在享受陪伴体验的同时，保持与现实世界的健康社交联系。</li>
              </ul>
            </section>

            <section>
              <h2>9. 特别鸣谢</h2>
              <p>特别鸣谢 B站 UP 主 <ExternalLink href="https://space.bilibili.com/457683484">是依七哒</ExternalLink> 制作并分享的 Live2D 模型相关资源，为本项目的桌宠展示提供了重要参考与支持。本项目仍为个人非商用同人项目，相关素材版权归属原权利方；如有侵权或使用不当，将积极配合处理。</p>
            </section>

            <section>
              <h2>10. 贡献者致谢</h2>
              <p>感谢所有通过 GitHub 提交 Pull Request 为项目做出贡献的开发者。完整贡献者列表请查看：<ExternalLink href="https://github.com/Playa-0v0/Cyrene-Agent/graphs/contributors?from=2026%2F5%2F30">Cyrene-Agent 贡献者页面</ExternalLink></p>
              <p>同时也感谢所有在 Issues 中提交反馈、建议以及 Star 支持本项目的朋友。</p>
            </section>

            <section>
              <h2>11. 协议效力</h2>
              <p>使用本软件前，使用者必须阅读并通过首次启动页面明确接受本免责声明的全部条款。</p>
            </section>
          </article>
        </div>
      </main>
    </Layout>
  );
}

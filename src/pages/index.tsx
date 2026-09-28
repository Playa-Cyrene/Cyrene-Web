import Layout from '@theme/Layout';
import {ArrowDown, ArrowUpRight, Check, Monitor, MousePointerClick} from 'lucide-react';
import MainWindowDemo from '../components/product-demo/MainWindowDemo';

export default function Home() {
  return (
    <Layout title="Cyrene" description="认识 Cyrene：陪伴你聊天、工作、编程与学习的桌面伙伴。">
      <main>
        <section className="cyrene-hero relative isolate overflow-hidden px-6 pb-12 pt-[clamp(4.5rem,10vw,7.5rem)] text-center sm:pb-14 sm:pt-[clamp(5rem,9vw,7.75rem)]">
          <div className="mx-auto flex max-w-[780px] flex-col items-center">
            <p className="cyrene-kicker mb-5 text-[11px] font-semibold tracking-[.13em] sm:text-xs">
              专为桌面而生的 AI 伙伴
            </p>
            <h1 className="cyrene-title m-0 max-w-[760px] text-balance text-[clamp(2.45rem,5.1vw,3.75rem)] font-medium leading-[1.12] tracking-[-.025em]">
              让昔涟陪你<br />
              <span className="cyrene-accent">把想法变成行动</span>
            </h1>
            <p className="cyrene-description mt-5 max-w-[610px] text-[14px] leading-[1.8] sm:mt-6 sm:text-[15px]">
              从日常对话到工作协助、代码编写与学习陪伴，Cyrene Agent 把熟悉的角色和真正有用的能力带到同一个桌面窗口。
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:mt-8">
              <a
                className="cyrene-primary-button inline-flex h-10 items-center gap-2 rounded-[7px] px-[18px] text-[12px] font-medium no-underline transition-colors sm:h-11 sm:px-5 sm:text-[13px]"
                href="https://github.com/Playa-Cyrene/Cyrene-Agent"
                target="_blank"
                rel="noreferrer">
                了解 Cyrene <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <a
                className="cyrene-secondary-button inline-flex h-10 items-center gap-2 rounded-[7px] border px-[18px] text-[12px] font-medium no-underline transition-colors sm:h-11 sm:px-5 sm:text-[13px]"
                href="https://github.com/Playa-Cyrene/Cyrene-Agent/releases"
                target="_blank"
                rel="noreferrer">
                获取桌面版 <ArrowDown size={14} aria-hidden="true" />
              </a>
            </div>

            <div className="cyrene-note mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] sm:mt-8 sm:gap-x-6 sm:text-xs">
              <span className="inline-flex items-center gap-1.5"><MousePointerClick size={14} className="cyrene-note-icon" aria-hidden="true" />界面可点击探索</span>
              <span className="cyrene-note-divider hidden h-3 w-px sm:block" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5"><Check size={13} className="cyrene-note-icon" aria-hidden="true" />展示内容均为示例</span>
              <span className="cyrene-note-divider hidden h-3 w-px sm:block" aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5"><Monitor size={14} className="cyrene-note-icon" aria-hidden="true" />无需连接后端服务</span>
            </div>
          </div>
        </section>
        <MainWindowDemo />
      </main>
    </Layout>
  );
}

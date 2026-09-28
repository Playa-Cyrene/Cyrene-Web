import Layout from '@theme/Layout';
import {ArrowUpRight} from 'lucide-react';
import MainWindowDemo from '../components/product-demo/MainWindowDemo';
import ProviderMarquee from '../components/ProviderMarquee';
import FeatureShowcase from '../components/FeatureShowcase';
import SiteFooter from '../components/SiteFooter';

export default function Home() {
  return (
    <Layout title="Cyrene" description="认识 Cyrene：陪伴你聊天、工作、编程与学习的桌面伙伴。">
      <main>
        <div className="cyrene-hero-transition">
        <section className="cyrene-hero relative isolate overflow-hidden px-6 pb-12 pt-[clamp(4.5rem,10vw,7.5rem)] text-center sm:pb-14 sm:pt-[clamp(5rem,9vw,7.75rem)]">
          <div className="mx-auto flex max-w-[780px] flex-col items-center">
            <img
              src="/img/logo.png"
              alt="Cyrene"
              className="cyrene-hero-logo mb-5 h-20 w-20 object-contain sm:mb-6 sm:h-24 sm:w-24"
            />
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
                href="/download">
                <svg className="cyrene-windows-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M1 4.1 10.2 2.8v8.7H1V4.1Zm0 9.1h9.2v8.7L1 20.6v-7.4Zm10.7-10.6L23 1v10.5H11.7V2.6Zm0 10.6H23v10.5l-11.3-1.6V13.2Z" fill="currentColor" />
                </svg>
                获取桌面版
              </a>
            </div>

          </div>
        </section>
        <ProviderMarquee />
        </div>
        <MainWindowDemo />
        <FeatureShowcase />
      </main>
      <SiteFooter />
    </Layout>
  );
}

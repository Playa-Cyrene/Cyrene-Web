import {useEffect, useState} from 'react';
import Marquee from 'react-fast-marquee';
import './provider-marquee.css';

const providers = [
  {name: 'OpenAI', logo: 'openai.svg'},
  {name: 'Claude', logo: 'claude.svg'},
  {name: 'DeepSeek', logo: 'deepseek.svg'},
  {name: '豆包', logo: 'doubao.svg'},
  {name: 'GLM', logo: 'glm.svg'},
  {name: 'Kimi', logo: 'kimi.svg'},
  {name: 'Qwen', logo: 'qwen.svg'},
  {name: 'MiniMax', logo: 'minimax.svg'},
  {name: 'MiMo', logo: 'xiaomimimo.svg'},
  {name: 'Grok', logo: 'grok.svg'},
  {name: 'Gemini', logo: 'gemini.svg'},
];

export default function ProviderMarquee() {
  const [play, setPlay] = useState(true);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePlayback = () => setPlay(!motionPreference.matches);
    updatePlayback();
    motionPreference.addEventListener('change', updatePlayback);
    return () => motionPreference.removeEventListener('change', updatePlayback);
  }, []);

  return (
    <section className="cyrene-providers" aria-labelledby="cyrene-providers-title">
      <div className="cyrene-providers__inner">
        <p className="cyrene-providers__eyebrow" id="cyrene-providers-title">
          内置支持 <span aria-hidden="true">·</span> 11 家模型服务商
        </p>
        <ul className="cyrene-providers__accessible-list">
          {providers.map(({name}) => <li key={name}>{name}</li>)}
        </ul>
        <div className="cyrene-providers__viewport" aria-hidden="true">
          <Marquee
            className="cyrene-providers__marquee"
            autoFill
            pauseOnHover
            play={play}
            speed={32}>
            {providers.map(({name, logo}) => (
              <span className="cyrene-provider" key={name}>
                {logo ? (
                  <span className="cyrene-provider__logo-tile">
                    <img src={`/img/providers/${logo}`} alt="" loading="lazy" />
                  </span>
                ) : (
                  <span className="cyrene-provider__letter">豆</span>
                )}
                <span className="cyrene-provider__name">{name}</span>
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

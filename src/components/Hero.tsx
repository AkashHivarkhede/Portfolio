import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { personal } from '@/data/portfolio';
import HeroScene from './HeroScene';
import type { ThemeName } from '@/hooks/useTheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function Hero({ theme }: { theme: ThemeName }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(preRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(titleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
      .fromTo(subRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
  }, [reduced]);

  // Typing effect for hero sub
  useEffect(() => {
    if (reduced) {
      if (subRef.current) subRef.current.textContent = personal.heroSub;
      return;
    }
    const el = subRef.current;
    if (!el) return;
    el.textContent = '';
    let i = 0;
    let timeoutId = 0;
    const type = () => {
      if (i < personal.heroSub.length) {
        el.textContent = personal.heroSub.slice(0, i + 1);
        i++;
        timeoutId = window.setTimeout(type, 30);
      }
    };
    const startTimer = window.setTimeout(type, 800);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(timeoutId);
    };
  }, [reduced]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6"
    >
      <HeroScene theme={theme} />

      <div className="relative z-10 max-w-4xl">
        <div
          ref={preRef}
          className="font-mono text-sm text-[var(--accent2)] tracking-[4px] uppercase mb-6 opacity-0"
        >
          /// {personal.preTitle}
        </div>

        <h1
          ref={titleRef}
          className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[1.05] mb-5 opacity-0"
        >
          Hi, I'm
          <br />
          <span className="outline-text">Akash</span>{' '}
          <span className="text-[var(--accent)]">I'm Full-Stack Developer</span>
        </h1>

        <p
          ref={subRef}
          className="text-lg text-[var(--text-dim)] max-w-xl leading-relaxed mb-10 min-h-[3.5rem] opacity-0"
        />

        <div
          ref={ctaRef}
          className="flex gap-5 flex-wrap justify-center opacity-0"
        >
          <button
            onClick={() => scrollTo('#projects')}
            className="btn-primary magnetic cursor-target group flex items-center gap-2"
          >
            View Work
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => scrollTo('#contact')}
            className="btn-outline magnetic cursor-target"
          >
            Get in Touch
          </button>
        </div>
      </div>

      <button
        onClick={() => scrollTo('#about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--text-dim)] hover:text-[var(--accent2)] transition-colors cursor-target"
        aria-label="Scroll down"
      >
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import { experiences } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const items = timelineRef.current?.querySelectorAll('.timeline-item');
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section id="experience" className="relative min-h-screen px-6 md:px-12 py-24">
      <div className="reveal text-center mb-16">
        <div className="font-mono text-xs text-[var(--accent2)] tracking-[4px] uppercase mb-3">
          // career path
        </div>
        <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-bold">Where I've worked</h2>
      </div>

      <div ref={timelineRef} className="relative max-w-[800px] mx-auto">
        {/* Timeline line */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--accent)] via-[var(--accent2)] to-transparent" />

        {experiences.map((exp) => (
          <div
            key={exp.company}
            className="timeline-item relative pl-12 mb-14 opacity-0 -translate-x-5 transition-all duration-600"
          >
            {/* Node */}
            <div className="absolute left-[-6px] top-2 w-[14px] h-[14px] rounded-full bg-[var(--accent)] border-[3px] border-[var(--bg)] shadow-[0_0_20px_var(--accent-glow)]" />

            {/* Card */}
            <div className="glass-card p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] transition-all duration-300 hover:border-[var(--accent)] hover:-translate-y-1 cursor-target">
              <div className="font-mono text-xs text-[var(--accent2)] tracking-[2px] mb-2">
                {exp.date}
              </div>
              <h3 className="text-xl font-semibold mb-1">{exp.role}</h3>
              <p className="text-sm text-[var(--text-dim)] mb-3">
                {exp.company} • {exp.location}
              </p>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-3">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs tracking-[1px] bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

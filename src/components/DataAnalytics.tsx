import { useEffect, useRef } from 'react';
import { BarChart3, Radar, PieChart } from 'lucide-react';
import { analyticsData } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const inViewRef = useRef(false);
  const checkInView = () => {
    const el = ref.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * (1 - threshold) && rect.bottom > window.innerHeight * threshold;
  };
  useEffect(() => {
    const onScroll = () => {
      inViewRef.current = checkInView();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    inViewRef.current = checkInView();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return { ref, inViewRef };
}

function BarChart({ data, animate }: { data: { label: string; value: number }[]; animate: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
    };
    resize();
    window.addEventListener('resize', resize);

    let progress = 0;
    let raf = 0;

    const draw = () => {
      if (animate) {
        progress = Math.min(progress + 0.02, 1);
      } else {
        progress = 1;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const padding = 40;
      const barCount = data.length;
      const barWidth = (w - padding * 2) / barCount * 0.6;
      const gap = (w - padding * 2) / barCount * 0.4;
      const maxBarHeight = h - padding * 2 - 30;

      const accent = getComputedStyle(document.body).getPropertyValue('--accent-rgb').trim() || '108, 92, 231';
      const accent2 = getComputedStyle(document.body).getPropertyValue('--accent2-rgb').trim() || '0, 206, 201';

      data.forEach((item, i) => {
        const x = padding + i * (barWidth + gap) + gap / 2;
        const barH = (item.value / 100) * maxBarHeight * progress;
        const y = h - padding - 25 - barH;

        const grad = ctx.createLinearGradient(x, y, x, h - padding - 25);
        grad.addColorStop(0, `rgba(${accent2}, 0.9)`);
        grad.addColorStop(1, `rgba(${accent}, 0.3)`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barH);

        ctx.fillStyle = `rgba(${accent2}, ${progress})`;
        ctx.font = 'bold 20px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(item.value * progress) + '%', x + barWidth / 2, y - 8);

        ctx.fillStyle = `rgba(200, 200, 200, ${0.5 * progress})`;
        ctx.font = '18px "Space Grotesk", sans-serif';
        ctx.fillText(item.label, x + barWidth / 2, h - padding + 5);
      });

      if (progress < 1) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [data, animate]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

function RadarChart({ data, animate }: { data: { label: string; value: number }[]; animate: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
    };
    resize();
    window.addEventListener('resize', resize);

    let progress = 0;
    let raf = 0;

    const draw = () => {
      if (animate) {
        progress = Math.min(progress + 0.02, 1);
      } else {
        progress = 1;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2 - 60;
      const sides = data.length;

      const accent = getComputedStyle(document.body).getPropertyValue('--accent-rgb').trim() || '108, 92, 231';
      const accent2 = getComputedStyle(document.body).getPropertyValue('--accent2-rgb').trim() || '0, 206, 201';

      for (let ring = 1; ring <= 4; ring++) {
        const r = (radius / 4) * ring;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255, 255, 255, 0.06)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        ctx.strokeStyle = `rgba(255, 255, 255, 0.06)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
        const r = (data[i].value / 100) * radius * progress;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${accent}, 0.15)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${accent2}, 0.8)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
        const r = (data[i].value / 100) * radius * progress;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accent2}, 1)`;
        ctx.fill();
      }

      if (progress >= 0.5) {
        const labelOpacity = (progress - 0.5) * 2;
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
          const lx = cx + Math.cos(angle) * (radius + 30);
          const ly = cy + Math.sin(angle) * (radius + 30);
          ctx.fillStyle = `rgba(200, 200, 200, ${labelOpacity})`;
          ctx.font = '16px "Space Grotesk", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(data[i].label, lx, ly);
        }
      }

      if (progress < 1) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [data, animate]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

function DonutChart({ data, animate }: { data: { label: string; value: number; color: string }[]; animate: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
    };
    resize();
    window.addEventListener('resize', resize);

    let progress = 0;
    let raf = 0;
    const total = data.reduce((s, d) => s + d.value, 0);

    const draw = () => {
      if (animate) {
        progress = Math.min(progress + 0.02, 1);
      } else {
        progress = 1;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2 - 40;
      const innerRadius = radius * 0.55;

      let currentAngle = -Math.PI / 2;

      data.forEach((item) => {
        const sliceAngle = (item.value / total) * Math.PI * 2 * progress;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(cx, cy, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();

        const resolvedColor = resolveColor(item.color);
        ctx.fillStyle = resolvedColor;
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        currentAngle += sliceAngle;
      });

      if (progress >= 0.8) {
        const labelOpacity = (progress - 0.8) * 5;
        currentAngle = -Math.PI / 2;
        data.forEach((item) => {
          const sliceAngle = (item.value / total) * Math.PI * 2;
          const midAngle = currentAngle + sliceAngle / 2;
          const labelR = (radius + innerRadius) / 2;
          const lx = cx + Math.cos(midAngle) * labelR;
          const ly = cy + Math.sin(midAngle) * labelR;

          ctx.fillStyle = `rgba(255, 255, 255, ${labelOpacity})`;
          ctx.font = 'bold 18px "Space Grotesk", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.value + '%', lx, ly);

          currentAngle += sliceAngle;
        });
      }

      if (progress < 1) raf = requestAnimationFrame(draw);
    };

    const resolveColor = (varName: string) => {
      if (varName === 'var(--accent)') {
        const rgb = getComputedStyle(document.body).getPropertyValue('--accent-rgb').trim() || '108, 92, 231';
        return `rgba(${rgb}, 0.85)`;
      }
      if (varName === 'var(--accent2)') {
        const rgb = getComputedStyle(document.body).getPropertyValue('--accent2-rgb').trim() || '0, 206, 201';
        return `rgba(${rgb}, 0.85)`;
      }
      if (varName === 'var(--accent2-light)') {
        const rgb = getComputedStyle(document.body).getPropertyValue('--accent2-rgb').trim() || '0, 206, 201';
        return `rgba(${rgb}, 0.45)`;
      }
      return varName;
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [data, animate]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export default function DataAnalytics() {
  const reduced = useReducedMotion();
  const { ref: sectionRef, inViewRef } = useInView<HTMLElement>(0.15);
  const animated = inViewRef.current && !reduced;

  return (
    <section
      id="analytics"
      ref={sectionRef}
      className="relative min-h-screen px-6 md:px-12 py-24"
    >
      <div className="reveal text-center mb-16">
        <div className="font-mono text-xs text-[var(--accent2)] tracking-[4px] uppercase mb-3">
          // data & analytics
        </div>
        <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-bold mb-4">Data tells the story</h2>
        <p className="text-[var(--text-dim)] max-w-2xl mx-auto text-lg">
          I'm expanding my skill set into data science and analytics — combining my software engineering
          foundation with statistical thinking, data exploration, and visual storytelling.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Bar Chart */}
        <div className="reveal glass-card bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 cursor-target hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="font-semibold text-sm uppercase tracking-wider">Skill Proficiency</h3>
          </div>
          <div className="h-[260px]">
            <BarChart data={analyticsData.skillBars} animate={animated} />
          </div>
        </div>

        {/* Radar Chart */}
        <div className="reveal glass-card bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 cursor-target hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-2 mb-4">
            <Radar className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="font-semibold text-sm uppercase tracking-wider">Analytics Radar</h3>
          </div>
          <div className="h-[260px]">
            <RadarChart data={analyticsData.radar} animate={animated} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="reveal glass-card bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 cursor-target hover:border-[var(--accent)] transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="font-semibold text-sm uppercase tracking-wider">Focus Distribution</h3>
          </div>
          <div className="h-[260px]">
            <DonutChart data={analyticsData.donut} animate={animated} />
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {analyticsData.donut.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    background:
                      item.color === 'var(--accent)'
                        ? 'var(--accent)'
                        : item.color === 'var(--accent2)'
                        ? 'var(--accent2)'
                        : 'var(--accent2)',
                    opacity: item.color === 'var(--accent2-light)' ? 0.5 : 1,
                  }}
                />
                <span className="text-xs text-[var(--text-dim)]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reveal max-w-3xl mx-auto mt-12 text-center">
        <p className="text-[var(--text-dim)] leading-relaxed">
          From writing SQL queries that surface insights, to building Python notebooks that explore datasets,
          to creating dashboards that make numbers meaningful — I bring a developer's toolkit to data problems.
        </p>
      </div>
    </section>
  );
}

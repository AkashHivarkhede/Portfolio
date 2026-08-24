import { useEffect, useRef } from 'react';
import { stats } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.textContent = target + '+';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let current = 0;
            const step = target / 40;
            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = Math.floor(current) + '+';
            }, 30);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, reduced]);

  return <span ref={ref} className="stat-num">0</span>;
}

export default function About() {
  const visualRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = visualRef.current?.querySelector('canvas');
    if (!canvas) return;
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    if (!ctx) return;

    const canvasEl = canvas as HTMLCanvasElement;
    const resize = () => {
      const rect = canvasEl.parentElement!.getBoundingClientRect();
      canvasEl.width = rect.width * 2;
      canvasEl.height = rect.height * 2;
    };
    resize();
    window.addEventListener('resize', resize);

    const phi = (1 + Math.sqrt(5)) / 2;
    const verts = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ].map((v) => {
      const l = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
      return [(v[0] / l) * 120, (v[1] / l) * 120, (v[2] / l) * 120];
    });

    const edges = [
      [0, 1], [0, 5], [0, 7], [0, 10], [0, 11], [1, 5], [1, 7], [1, 8], [1, 9],
      [2, 3], [2, 4], [2, 6], [2, 10], [2, 11], [3, 4], [3, 6], [3, 8], [3, 9],
      [4, 5], [4, 9], [4, 11], [5, 9], [5, 11], [6, 7], [6, 8], [6, 10],
      [7, 8], [7, 10], [8, 9], [10, 11],
    ];

    let rotX = 0, rotY = 0, mouseAX = 0, mouseAY = 0;
    let raf = 0;

    const parent = canvasEl.parentElement!;
    const onMouse = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseAX = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseAY = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    };
    parent.addEventListener('mousemove', onMouse);

    const project3D = (x: number, y: number, z: number) => {
      const fov = 400;
      const scale = fov / (fov + z);
      return [x * scale + canvasEl.width / 2, y * scale + canvasEl.height / 2, scale];
    };

    const rotatePoint = (x: number, y: number, z: number, rx: number, ry: number) => {
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const y1 = y * cosX - z * sinX, z1 = y * sinX + z * cosX;
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const x1 = x * cosY + z1 * sinY, z2 = -x * sinY + z1 * cosY;
      return [x1, y1, z2];
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      rotX += (mouseAX * 0.3 - rotX) * 0.02;
      rotY += (mouseAY * 0.3 - rotY) * 0.02;
      const time = Date.now() * 0.0005;
      const rx = rotX + time * 0.3;
      const ry = rotY + time * 0.5;

      const projected = verts.map((v) => {
        const [x, y, z] = rotatePoint(v[0], v[1], v[2], rx, ry);
        return project3D(x, y, z);
      });

      const accent = getComputedStyle(document.body).getPropertyValue('--accent-rgb').trim() || '108, 92, 231';
      const accent2 = getComputedStyle(document.body).getPropertyValue('--accent2-rgb').trim() || '0, 206, 201';

      edges.forEach(([a, b]) => {
        const [x1, y1, s1] = projected[a];
        const [x2, y2, s2] = projected[b];
        const avgScale = (s1 + s2) / 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${accent}, ${0.15 + avgScale * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      projected.forEach(([x, y, s]) => {
        const r = 3 * s + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accent2}, ${0.4 + s * 0.5})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, r * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
        grad.addColorStop(0, `rgba(${accent}, ${0.15 * s})`);
        grad.addColorStop(1, `rgba(${accent}, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return (
    <section id="about" className="relative min-h-screen flex items-center gap-16 px-6 md:px-12 py-24 flex-col lg:flex-row">
      <div ref={visualRef} className="reveal w-full lg:flex-1 max-w-[420px] mx-auto">
        <div className="about-3d-container relative w-full aspect-square rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--border)]">
          <canvas className="w-full h-full" />
          <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]" />
        </div>
      </div>

      <div className="flex-1 w-full">
        <div className="reveal mb-12">
          <div className="font-mono text-xs text-[var(--accent2)] tracking-[4px] uppercase mb-3">
            // about me
          </div>
          <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-bold leading-[1.1]">
            Turning ideas into
            <br />
            functional web applications
            <br />
            using .NET
          </h2>
        </div>

        <p className="reveal text-lg text-[var(--text-dim)] leading-[1.8] mb-8">
          I'm <strong className="text-[var(--text)]">Akash Hivorkhede</strong> — a BCA graduate (2024) with hands-on
          experience in Full Stack .NET development. I completed my internship as a Junior Software Engineer at{' '}
          <strong className="text-[var(--text)]">VHaaSh Technologies</strong>, where I worked on real-world web
          applications using .NET Core, ASP.NET MVC, Web API, and SQL Server. I enjoy building scalable backend systems
          and responsive user interfaces using modern web technologies. Currently, I am seeking an opportunity as a{' '}
          <strong className="text-[var(--text)]">Junior Software Engineer / .NET Developer</strong> to grow and
          contribute in a professional environment.
        </p>

        <div className="reveal grid grid-cols-3 gap-6 mt-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center py-6 px-4 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] transition-all duration-300 hover:border-[var(--accent)] hover:-translate-y-1 cursor-target"
            >
              <span className="text-[2.2rem] font-bold text-[var(--accent)] block">
                <Counter target={stat.target} />
              </span>
              <span className="text-xs text-[var(--text-dim)] tracking-[1px] uppercase mt-1 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

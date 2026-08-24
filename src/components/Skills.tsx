import { useEffect, useRef, useState } from 'react';
import { skillGroups } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Node = {
  name: string;
  ring: number;
  angle: number;
  radius: number;
};

const RING_RADII = [150, 230, 310];
const RING_SPEEDS = [30, 45, 60];
const RING_DIRECTIONS = [1, -1, 1];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  const rafRef = useRef(0);

  const nodes: Node[] = [];
  skillGroups.forEach((group) => {
    const radius = RING_RADII[group.ring - 1];
    const count = group.skills.length;
    group.skills.forEach((skill, i) => {
      nodes.push({
        name: skill,
        ring: group.ring,
        angle: (i / count) * Math.PI * 2,
        radius,
      });
    });
  });

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    const nodeEls = container.querySelectorAll<HTMLElement>('[data-skill]');
    const ringEls = container.querySelectorAll<HTMLElement>('[data-ring]');

    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - start) / 1000;

      ringEls.forEach((ring) => {
        const ringNum = parseInt(ring.dataset.ring!);
        const speed = RING_SPEEDS[ringNum - 1];
        const dir = RING_DIRECTIONS[ringNum - 1];
        const angle = (elapsed / speed) * Math.PI * 2 * dir;
        ring.style.transform = `rotate(${angle}rad)`;
      });

      nodeEls.forEach((el) => {
        const ring = parseInt(el.dataset.ring!);
        const speed = RING_SPEEDS[ring - 1];
        const dir = RING_DIRECTIONS[ring - 1];
        const counterAngle = -(elapsed / speed) * Math.PI * 2 * dir;
        el.style.transform = `rotate(${counterAngle}rad)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const cy = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setTilt({ x: cy * 10, y: -cx * 10 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section id="skills" className="relative min-h-screen px-6 md:px-12 py-24">
      <div className="reveal text-center mb-16">
        <div className="font-mono text-xs text-[var(--accent2)] tracking-[4px] uppercase mb-3">
          // tech stack
        </div>
        <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-bold">Tools of the trade</h2>
      </div>

      <div
        className="flex justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: '1000px' }}
      >
        <div
          ref={containerRef}
          className="relative reveal"
          style={{
            width: '700px',
            height: '700px',
            maxWidth: '90vw',
            maxHeight: '90vw',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s ease',
          }}
        >
          {/* Orbit rings */}
          {RING_RADII.map((r, i) => (
            <div
              key={i}
              data-ring={i + 1}
              className="absolute top-1/2 left-1/2 rounded-full border border-[var(--border)]"
              style={{
                width: r * 2,
                height: r * 2,
                marginLeft: -r,
                marginTop: -r,
                transformStyle: 'preserve-3d',
              }}
            />
          ))}

          {/* Center */}
          <div
            className="absolute top-1/2 left-1/2 w-[120px] h-[120px] rounded-full flex items-center justify-center font-bold text-sm text-center z-[5] bg-[var(--accent)] text-white"
            style={{
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 60px rgba(108, 92, 231, 0.3)',
              lineHeight: 1.3,
            }}
          >
            Core
            <br />
            Skills
          </div>

          {/* Skill nodes */}
          {nodes.map((node) => {
            const x = Math.cos(node.angle) * node.radius;
            const y = Math.sin(node.angle) * node.radius;
            const isHovered = hovered === node.name;
            return (
              <div
                key={node.name}
                data-skill={node.name}
                data-ring={node.ring}
                className="absolute top-1/2 left-1/2 w-[62px] h-[62px] flex items-center justify-center text-[0.6rem] font-semibold text-center cursor-pointer cursor-target rounded-full bg-[var(--card-bg)] border border-[var(--border)] transition-all duration-300"
                style={{
                  marginLeft: x - 31,
                  marginTop: y - 31,
                  transformStyle: 'preserve-3d',
                  background: isHovered ? 'var(--accent)' : undefined,
                  color: isHovered ? '#fff' : undefined,
                  borderColor: isHovered ? 'var(--accent)' : undefined,
                  boxShadow: isHovered ? '0 0 30px var(--accent-glow)' : undefined,
                  zIndex: isHovered ? 10 : undefined,
                }}
                onMouseEnter={() => setHovered(node.name)}
                onMouseLeave={() => setHovered(null)}
              >
                {node.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hovered skill display */}
      <div className="text-center mt-8 h-8">
        <span className="font-mono text-sm text-[var(--accent2)] transition-opacity duration-300">
          {hovered ? `> ${hovered}` : ''}
        </span>
      </div>
    </section>
  );
}

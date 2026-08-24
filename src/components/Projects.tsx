import { useEffect, useRef, useState } from 'react';
import { Bus, Database, GraduationCap, Globe, Mic, Briefcase, X, ArrowUpRight } from 'lucide-react';
import { projects, type Project } from '@/data/portfolio';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  bus: Bus,
  database: Database,
  graduation: GraduationCap,
  globe: Globe,
  mic: Mic,
  briefcase: Briefcase,
};

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const Icon = ICONS[project.icon] ?? Globe;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');

    const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * -8;
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      className="project-card reveal relative bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-9 overflow-hidden cursor-pointer cursor-target transition-all duration-400"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), var(--accent-glow-soft), transparent 60%)',
        }}
      />

      {/* Link icon */}
      <div className="absolute top-6 right-6 w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
        <ArrowUpRight className="w-4 h-4" />
      </div>

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: project.color }}
      >
        <Icon className="w-6 h-6 text-[var(--text)]" />
      </div>

      <h3 className="text-xl font-semibold mb-2.5">{project.title}</h3>
      <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-5 line-clamp-3">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--accent2)]/10 text-[var(--accent2)] border border-[var(--accent2)]/15"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section id="projects" className="relative min-h-screen px-6 md:px-12 py-24">
      <div className="reveal text-center mb-16">
        <div className="font-mono text-xs text-[var(--accent2)] tracking-[4px] uppercase mb-3">
          // selected work
        </div>
        <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-bold">Things I've built</h2>
      </div>

      <div className="grid gap-8 max-w-6xl mx-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelected(project)}
          />
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-6"
          onClick={(e) => {
            if (e.target === modalRef.current) setSelected(null);
          }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            style={{ animation: 'fadeIn 0.3s ease forwards' }}
          />
          <div
            ref={modalRef}
            className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl p-8 md:p-10"
            style={{ animation: 'modalIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards' }}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all cursor-target"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: selected.color }}
            >
              {(() => {
                const Icon = ICONS[selected.icon] ?? Globe;
                return <Icon className="w-7 h-7 text-[var(--text)]" />;
              })()}
            </div>

            <h3 className="text-2xl font-bold mb-4">{selected.title}</h3>
            <p className="text-[var(--text-dim)] leading-relaxed mb-6">{selected.description}</p>

            <div className="mb-6">
              <div className="font-mono text-xs text-[var(--accent2)] tracking-[2px] uppercase mb-3">
                Technologies
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-md text-xs font-mono bg-[var(--accent2)]/10 text-[var(--accent2)] border border-[var(--accent2)]/15"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {selected.url ? (
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary magnetic cursor-target inline-flex items-center gap-2"
              >
                Visit Project
                <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : (
              <p className="text-sm text-[var(--text-dim)] italic">
                No live link available for this project.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

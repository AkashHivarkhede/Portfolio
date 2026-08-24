import { useEffect, useRef, useState } from 'react';
import { Mail, Github, Linkedin, FileText, Copy, Check } from 'lucide-react';
import { personal } from '@/data/portfolio';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('visible');
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = personal.email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const contacts = [
    {
      icon: Mail,
      label: personal.email,
      action: copyEmail,
      isButton: true,
    },
    {
      icon: Github,
      label: personal.githubLabel,
      href: personal.github,
    },
    {
      icon: Linkedin,
      label: personal.linkedinLabel,
      href: personal.linkedin,
    },
    {
      icon: FileText,
      label: personal.resumeLabel,
      href: personal.resume,
    },
  ];

  return (
    <section id="contact" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">
      <div className="reveal font-mono text-xs text-[var(--accent2)] tracking-[4px] uppercase mb-6">
        // let's connect
      </div>

      <h2 ref={titleRef} className="contact-title reveal text-[clamp(2.2rem,6vw,5rem)] font-bold mb-6 leading-[1.1]">
        Have an idea?
        <br />
        Let's build
        <br />
        <span className="text-[var(--accent2)]">something great.</span>
      </h2>

      <p className="reveal text-lg text-[var(--text-dim)] max-w-md mb-12 leading-relaxed">
        I'm always open to discussing new projects, creative ideas, or opportunities to be part of something amazing.
      </p>

      <div className="reveal flex gap-5 flex-wrap justify-center">
        {contacts.map((contact) => {
          const Icon = contact.icon;
          const content = (
            <span className="flex items-center gap-2.5">
              <Icon className="w-4.5 h-4.5" />
              {contact.label}
              {contact.isButton && (copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-3.5 h-3.5 opacity-60" />)}
            </span>
          );

          const className =
            'contact-pill magnetic cursor-target flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-sm transition-all duration-300 hover:border-[var(--accent)] hover:-translate-y-1';

          if (contact.isButton) {
            return (
              <button key={contact.label} onClick={contact.action} className={className}>
                {content}
              </button>
            );
          }
          return (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {content}
            </a>
          );
        })}
      </div>
    </section>
  );
}

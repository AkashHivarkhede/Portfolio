import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { navLinks } from '@/data/portfolio';
import { themes, type ThemeName } from '@/hooks/useTheme';
import { useActiveSection } from '@/hooks/useActiveSection';

type Props = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
};

export default function Navigation({ theme, setTheme }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLLIElement>(null);
  const active = useActiveSection(navLinks.map((l) => l.href.slice(1)));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[1000] flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? 'py-3 px-6 md:px-12 backdrop-blur-xl bg-[var(--nav-bg)] border-b border-[var(--border)]'
          : 'py-6 px-6 md:px-12'
      }`}
    >
      <a
        href="#hero"
        onClick={(e) => handleNavClick(e, '#hero')}
        className="font-bold text-lg tracking-[3px] uppercase cursor-target"
      >
        A<span className="text-[var(--accent)]">.</span>DEV
      </a>

      <ul className="hidden md:flex items-center gap-8 list-none">
        {navLinks.map((link) => {
          const id = link.href.slice(1);
          const isActive = active === id;
          return (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative text-sm tracking-[2px] uppercase font-normal pb-1 transition-colors duration-300 cursor-target ${
                  isActive ? 'text-[var(--text)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-[1px] bg-[var(--accent2)] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0'
                  }`}
                />
              </a>
            </li>
          );
        })}
        <li className="relative" ref={themeDropdownRef}>
          <button
            onClick={() => setThemeOpen((o) => !o)}
            className="flex items-center gap-1 text-sm tracking-[2px] uppercase text-[var(--text-dim)] hover:text-[var(--text)] transition-colors cursor-target"
            aria-label="Change theme"
            aria-expanded={themeOpen}
          >
            Theme
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${themeOpen ? 'rotate-180' : ''}`} />
          </button>
          <ul
            className={`absolute top-full right-0 mt-2 min-w-[140px] bg-[var(--card-bg)] border border-[var(--border)] rounded-xl py-2 backdrop-blur-xl transition-all duration-300 origin-top ${
              themeOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
            }`}
          >
            {themes.map((t) => (
              <li key={t.name}>
                <button
                  onClick={() => {
                    setTheme(t.name);
                    setThemeOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-sm transition-colors cursor-target ${
                    theme === t.name
                      ? 'text-[var(--accent)] font-semibold'
                      : 'text-[var(--text)] hover:bg-[var(--accent)] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </li>
      </ul>

      <button
        className="md:hidden flex flex-col items-center justify-center w-10 h-10 z-[1001] cursor-target"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-screen w-[70%] max-w-sm bg-[var(--nav-bg)] backdrop-blur-2xl flex flex-col items-center justify-center gap-8 transition-transform duration-400 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {navLinks.map((link) => {
          const id = link.href.slice(1);
          const isActive = active === id;
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-lg tracking-[2px] uppercase cursor-target ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--text)]'
              }`}
            >
              {link.label}
            </a>
          );
        })}
        <div className="flex gap-3 mt-4">
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              className={`px-4 py-2 rounded-full text-sm border cursor-target ${
                theme === t.name
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10'
                  : 'border-[var(--border)] text-[var(--text-dim)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-[999]"
          onClick={() => setOpen(false)}
        />
      )}
    </nav>
  );
}

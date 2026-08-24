import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (ref.current) ref.current.style.width = progress + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 h-[3px] z-[9999] w-0 transition-[width] duration-75"
      style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent2))' }}
      aria-hidden="true"
    />
  );
}

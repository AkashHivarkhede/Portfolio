import { personal } from '@/data/portfolio';

export default function Footer() {
  return (
    <footer className="relative z-10 text-center py-10 px-6 text-xs text-[var(--text-dim)] border-t border-[var(--border)]">
      <p>Designed & Built by {personal.firstName} © {personal.footerYear} — All rights reserved</p>
    </footer>
  );
}

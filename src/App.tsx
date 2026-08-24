import { useTheme } from '@/hooks/useTheme';
import { useMagnetic } from '@/hooks/useMagnetic';
import CustomCursor from '@/components/CustomCursor';
import ParticleBackground from '@/components/ParticleBackground';
import ScrollProgress from '@/components/ScrollProgress';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import DataAnalytics from '@/components/DataAnalytics';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function App() {
  const { theme, setTheme } = useTheme();
  useMagnetic();

  return (
    <div className="relative min-h-screen">
      <ParticleBackground theme={theme} />
      <CustomCursor />
      <ScrollProgress />
      <Navigation theme={theme} setTheme={setTheme} />
      <RevealOnScroll />

      <main className="relative z-10">
        <Hero theme={theme} />
        <About />
        <Skills />
        <DataAnalytics />
        <Experience />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

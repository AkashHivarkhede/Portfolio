import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { ThemeName } from '@/hooks/useTheme';

const THEME_COLORS: Record<ThemeName, { accent: number; accent2: number }> = {
  default: { accent: 0x6c5ce7, accent2: 0x00cec9 },
  red: { accent: 0xff2e2e, accent2: 0xff6b6b },
  light: { accent: 0x2563eb, accent2: 0x0ea5e9 },
};

export default function HeroScene({ theme }: { theme: ThemeName }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Wireframe icosahedron
    const geo = new THREE.IcosahedronGeometry(1.8, 1);
    const wireframe = new THREE.WireframeGeometry(geo);
    const lineMat = new THREE.LineBasicMaterial({
      color: THEME_COLORS[themeRef.current].accent,
      transparent: true,
      opacity: 0.4,
    });
    const lines = new THREE.LineSegments(wireframe, lineMat);
    scene.add(lines);

    // Inner solid icosahedron
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: THEME_COLORS[themeRef.current].accent2,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Particles
    const particleCount = isMobile ? 150 : 400;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: THEME_COLORS[themeRef.current].accent2,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // Mouse
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      lines.rotation.x = elapsed * 0.15 + mouseY * 0.3;
      lines.rotation.y = elapsed * 0.2 + mouseX * 0.3;
      innerMesh.rotation.x = -elapsed * 0.2;
      innerMesh.rotation.y = -elapsed * 0.25;
      points.rotation.y = elapsed * 0.05;
      points.rotation.x = elapsed * 0.03;

      // Update colors on theme change
      const c = THEME_COLORS[themeRef.current];
      lineMat.color.setHex(c.accent);
      innerMat.color.setHex(c.accent2);
      pMat.color.setHex(c.accent2);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      wireframe.dispose();
      innerGeo.dispose();
      pGeo.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
}

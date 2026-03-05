import { useEffect, useState, useCallback } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

const COLORS = [
  "#00d4ff",
  "#00ff88",
  "#ff6b35",
  "#7c3aed",
  "#ff2d78",
  "#ffd60a",
];

/**
 * Konami code easter egg.
 * Activates a particle explosion across the whole viewport.
 */
export function KonamiEasterEgg() {
  const [keyIndex, setKeyIndex] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [active, setActive] = useState(false);

  const explode = useCallback(() => {
    const count = 120;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 4 + Math.random() * 12;
      newParticles.push({
        id: i,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
      });
    }

    setParticles(newParticles);
    setActive(true);
  }, []);

  // Listen for Konami code
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const expected = KONAMI_CODE[keyIndex];
      if (e.key === expected || e.key.toLowerCase() === expected) {
        const next = keyIndex + 1;
        if (next === KONAMI_CODE.length) {
          setKeyIndex(0);
          explode();
        } else {
          setKeyIndex(next);
        }
      } else {
        setKeyIndex(0);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [keyIndex, explode]);

  // Animate particles
  useEffect(() => {
    if (!active || particles.length === 0) return;

    let raf: number;
    const animate = () => {
      setParticles((prev) => {
        const next = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
            life: p.life - 0.012,
          }))
          .filter((p) => p.life > 0);

        if (next.length === 0) {
          setActive(false);
        }
        return next;
      });
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [active, particles.length]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.life,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}

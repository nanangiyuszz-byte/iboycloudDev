import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { techStack } from "./TechIcons";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy } from "lucide-react";

type Logo = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  iconIndex: number;
  size: number;
};

type Particle = { id: number; x: number; y: number; dx: number; dy: number };

const TARGET_SCORE = 10;

export default function Game() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 600, h: 380 });
  const [logos, setLogos] = useState<Logo[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [celebrated, setCelebrated] = useState(false);
  const idRef = useRef(0);
  const partIdRef = useRef(0);

  const createLogo = useCallback(
    (w: number, h: number): Logo => {
      const s = 48;
      return {
        id: ++idRef.current,
        x: Math.random() * (w - s),
        y: Math.random() * (h - s),
        vx: (Math.random() - 0.5) * 2.4,
        vy: (Math.random() - 0.5) * 2.4,
        iconIndex: Math.floor(Math.random() * techStack.length),
        size: s,
      };
    },
    []
  );

  const reset = useCallback(() => {
    const w = containerRef.current?.clientWidth ?? 600;
    const h = containerRef.current?.clientHeight ?? 380;
    setSize({ w, h });
    setLogos(Array.from({ length: 5 }, () => createLogo(w, h)));
    setScore(0);
    setCelebrated(false);
  }, [createLogo]);

  useEffect(() => {
    reset();
    const onResize = () => {
      const w = containerRef.current?.clientWidth ?? 600;
      const h = containerRef.current?.clientHeight ?? 380;
      setSize({ w, h });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [reset]);

  // animation loop
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setLogos((prev) =>
        prev.map((l) => {
          let { x, y, vx, vy } = l;
          x += vx;
          y += vy;
          if (x <= 0 || x + l.size >= size.w) vx = -vx;
          if (y <= 0 || y + l.size >= size.h) vy = -vy;
          x = Math.max(0, Math.min(size.w - l.size, x));
          y = Math.max(0, Math.min(size.h - l.size, y));
          return { ...l, x, y, vx, vy };
        })
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [size.w, size.h]);

  // cleanup particles
  useEffect(() => {
    if (!particles.length) return;
    const t = setTimeout(() => setParticles([]), 700);
    return () => clearTimeout(t);
  }, [particles]);

  const handleHit = (logo: Logo, e: React.MouseEvent) => {
    e.stopPropagation();
    setScore((s) => s + 1);
    // particle burst
    const cx = logo.x + logo.size / 2;
    const cy = logo.y + logo.size / 2;
    const burst: Particle[] = Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      return {
        id: ++partIdRef.current,
        x: cx,
        y: cy,
        dx: Math.cos(angle) * 60,
        dy: Math.sin(angle) * 60,
      };
    });
    setParticles((p) => [...p, ...burst]);
    // respawn the hit logo
    setLogos((prev) =>
      prev.map((l) => (l.id === logo.id ? createLogo(size.w, size.h) : l))
    );
  };

  useEffect(() => {
    if (score >= TARGET_SCORE && !celebrated) {
      setCelebrated(true);
      const rect = containerRef.current?.getBoundingClientRect();
      const origin = rect
        ? {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          }
        : { x: 0.5, y: 0.5 };
      confetti({
        particleCount: 140,
        spread: 90,
        origin,
        colors: ["#3B82F6", "#60A5FA", "#93C5FD", "#FFFFFF"],
      });
      setTimeout(
        () =>
          confetti({
            particleCount: 80,
            spread: 120,
            origin,
            colors: ["#3B82F6", "#1D4ED8", "#FFFFFF"],
          }),
        300
      );
    }
  }, [score, celebrated]);

  return (
    <section id="game" className="py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Engagement
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Catch the Logo
          </h2>
          <p className="mt-4 text-muted-foreground">
            Klik logo yang melayang untuk menambah skor. Capai{" "}
            <span className="font-semibold text-foreground">{TARGET_SCORE} poin</span>{" "}
            untuk perayaan!
          </p>
        </motion.div>

        <div className="glass relative overflow-hidden rounded-3xl p-4 shadow-elegant md:p-6">
          {/* HUD */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-soft backdrop-blur">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">
                Score: <span className="text-gradient">{score}</span>
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={reset}
              className="rounded-full bg-white/80 backdrop-blur"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Play Again
            </Button>
          </div>

          {/* arena */}
          <div
            ref={containerRef}
            className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white/70 via-secondary/60 to-primary/5 backdrop-blur"
          >
            {logos.map((l) => (
              <motion.button
                key={l.id}
                onClick={(e) => handleHit(l, e)}
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.15 }}
                style={{
                  position: "absolute",
                  left: l.x,
                  top: l.y,
                  width: l.size,
                  height: l.size,
                }}
                className="rounded-2xl bg-white/80 p-2 shadow-soft backdrop-blur transition-smooth hover:shadow-glow"
                aria-label="catch logo"
              >
                {techStack[l.iconIndex].icon}
              </motion.button>
            ))}
            {particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
                animate={{ x: p.x + p.dx, y: p.y + p.dy, opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="pointer-events-none absolute h-2 w-2 rounded-full bg-primary"
              />
            ))}
            {celebrated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto w-fit rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-primary shadow-elegant"
              >
                🎉 Selamat! Kamu pro!
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

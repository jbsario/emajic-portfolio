import { ChevronDown } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, animate, MotionValue } from "framer-motion";
import { useRef, useEffect, lazy, Suspense } from "react";
import heroFinished from "@/assets/hero-finished.jpg";

const HeroModel3D = lazy(() => import("@/components/three/HeroModel3D"));

const StageDot = ({ progress, stage, range }: { progress: MotionValue<number>; stage: string; range: [number, number, number] }) => {
  const opacity = useTransform(progress, range, [0.3, 1, 0.3]);
  return (
    <motion.div className="flex items-center gap-2" style={{ opacity }}>
      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/80">{stage}</span>
    </motion.div>
  );
};

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);

  // Auto-looping transformation progress (0 → 1 → 0 ...). Mouse accelerates it.
  const progress = useMotionValue(0);
  const speed = useMotionValue(1); // 1 = base, up to ~4 with mouse motion

  // Mouse for tilt + acceleration
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // 3D tilt
  const tiltX = useTransform(smoothMouseY, [0, 1], ["3deg", "-3deg"]);
  const tiltY = useTransform(smoothMouseX, [0, 1], ["-3deg", "3deg"]);
  const shiftX = useTransform(smoothMouseX, [0, 1], ["-20px", "20px"]);
  const shiftY = useTransform(smoothMouseY, [0, 1], ["-20px", "20px"]);

  // Sweep light follows mouse
  const sweepX = useTransform(smoothMouseX, [0, 1], ["-20%", "120%"]);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = performance.now();
    let speedDecayRaf = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);

      // Compute pointer velocity → boost speed
      const now = performance.now();
      const dt = Math.max(now - lastTime, 1);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const v = Math.sqrt(dx * dx + dy * dy) / dt; // px/ms
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
      // Map velocity to a multiplier (clamped)
      const boost = Math.min(1 + v * 1.5, 4);
      speed.set(Math.max(speed.get(), boost));
    };

    // Decay speed back to 1 smoothly
    const decay = () => {
      const cur = speed.get();
      if (cur > 1.01) speed.set(cur + (1 - cur) * 0.05);
      speedDecayRaf = requestAnimationFrame(decay);
    };
    decay();

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(speedDecayRaf);
    };
  }, [mouseX, mouseY, speed]);

  // Drive the looping progress with a ticker that respects current speed
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const baseDuration = 9000; // ms for one full Blueprint → Finished sweep
    const holdDuration = 1500; // ms hold on finished before reset
    let elapsed = 0;
    let holding = 0;

    const tick = (now: number) => {
      const dt = (now - last) * speed.get();
      last = now;
      if (holding > 0) {
        holding -= (now - last + dt);
        if (holding <= 0) {
          elapsed = 0;
          holding = 0;
        }
        progress.set(1);
      } else {
        elapsed += dt;
        const p = Math.min(elapsed / baseDuration, 1);
        progress.set(p);
        if (p >= 1) {
          holding = holdDuration;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, speed]);

  const title = "ETHEREAL MAJIC";
  const letters = title.split("");

  return (
    <section
      ref={ref}
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden bg-background"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ rotateX: tiltX, rotateY: tiltY }}
      >
        <motion.video
          src="/hero-reel.mp4"
          poster={heroFinished}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ x: shiftX, y: shiftY, scale: 1.05 }}
        />

        {/* Gold scanner sweep tied to mouse */}
        <motion.div
          className="absolute inset-y-0 w-[30%] pointer-events-none mix-blend-overlay"
          style={{
            left: sweepX,
            background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.5), transparent)",
            opacity: 0.35,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background) / 0.85) 100%)" }}
        />
        <motion.div
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{ background: "radial-gradient(circle at 30% 50%, hsl(var(--gold) / 0.6), transparent 50%)" }}
          animate={{ x: ["-10%", "10%", "-10%"], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Stage indicator */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        <StageDot progress={progress} stage="Design" range={[0, 0.1, 0.35]} />
        <StageDot progress={progress} stage="Build" range={[0.25, 0.45, 0.65]} />
        <StageDot progress={progress} stage="Reveal" range={[0.55, 0.85, 1]} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.15fr_1fr] items-center gap-8">
        <div className="text-center lg:text-left">
        <motion.div
          className="inline-block overflow-hidden mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.p
            className="text-xs md:text-sm tracking-[0.6em] uppercase text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            — Construction · Architecture · Interior Design —
          </motion.p>
        </motion.div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider mb-8 text-gold-gradient overflow-hidden drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          <span className="inline-block">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "120%", opacity: 0, rotateX: -90 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.8 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: "bottom" }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.div
          className="overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <motion.p
            className="text-foreground text-base md:text-lg max-w-xl mx-auto lg:mx-0 font-light tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 2, ease: [0.22, 1, 0.36, 1] }}
          >
            Transforming spaces into inspiring environments with design, renovation, and craftsmanship since 2022.
          </motion.p>
        </motion.div>

        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto lg:mx-0 mt-10"
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ duration: 1.5, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
        />

        </div>

        {/* Rotating 3D structure — desktop showcase */}
        <motion.div
          className="hidden lg:block relative h-[420px] pointer-events-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          <Suspense fallback={null}>
            <HeroModel3D progress={progress} />
          </Suspense>
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/80 hover:text-primary transition-colors z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{ opacity: { delay: 2.8, duration: 0.8 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
        aria-label="Scroll to about section"
      >
        <ChevronDown size={32} />
      </motion.button>
    </section>
  );
};

export default HeroSection;

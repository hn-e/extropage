"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ──────────── Screenshot Gallery Card ──────────── */

function ScreenshotCard({
  src,
  index,
}: {
  src: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowXY, setGlowXY] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cX = rect.width / 2;
    const cY = rect.height / 2;
    setTilt({ x: ((y - cY) / cY) * 6, y: ((x - cX) / cX) * -6 });
    setGlowXY({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlowXY({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="flex-shrink-0 w-[260px] sm:w-[300px] px-3"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="glass-border-neon glass-panel-pro rounded-2xl p-3 overflow-hidden cursor-pointer perspective-[1200px]"
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glow follow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowXY.x}% ${glowXY.y}%, rgba(255,255,255,0.06) 0%, transparent 55%)`,
          }}
        />

        {/* Metallic bezel frame */}
        <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#0a0a0a]">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-black rounded-b-lg z-10" />
          {/* Screenshot */}
          <img
            src={src}
            alt={`Extroverts screenshot ${index + 1}`}
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>

        {/* Label */}
        <div className="mt-3 flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/20 uppercase">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
}

const screenshotPaths = [
  "/assets/1.png",
  "/assets/2.png",
  "/assets/3.png",
  "/assets/4.png",
  "/assets/5.png",
  "/assets/6.png",
  "/assets/7.png",
];

export function PhoneShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

  const scrollGallery = (dir: "left" | "right") => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({
        left: dir === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={containerRef}
      id="phone-showcase"
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
    >
      {/* Ambient glow behind phone */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[900px] pointer-events-none opacity-15">
        <div className="absolute inset-0 bg-glow-radial" />
      </div>

      {/* Radial vignette — dark center behind text so it reads above white dots */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
      />

      <motion.div
        style={{ opacity, y, scale, background: "radial-gradient(ellipse 50% 40% at 50% 45%, rgba(10,10,10,0.7) 20%, transparent 100%)", }}
        className="relative z-10 flex flex-col items-center gap-10 text-center max-w-3xl"
      >
        {/* Section label */}
        <motion.div className="flex items-center gap-3">
          <span className="h-px w-8 bg-white/15" />
          <span className="font-mono text-xs tracking-[0.3em] text-white/30 uppercase">
            Featured Product
          </span>
          <span className="h-px w-8 bg-white/15" />
        </motion.div>

        {/* App name */}
        <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
          <span className="text-gradient-metallic">Extroverts</span>
        </h2>

        {/* Tagline */}
        <p className="text-base sm:text-lg text-white/25 max-w-md leading-relaxed">
          Party · Hangout · Vibe — a cross-platform mobile experience
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <span className="block font-mono text-2xl font-semibold text-white/50">5.0</span>
            <span className="text-[10px] tracking-[0.15em] text-white/20 uppercase mt-1">Rating</span>
          </div>
          <span className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <span className="block font-mono text-2xl font-semibold text-white/50">8K+</span>
            <span className="text-[10px] tracking-[0.15em] text-white/20 uppercase mt-1">Downloads</span>
          </div>
          <span className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <span className="block font-mono text-2xl font-semibold text-white/50">iOS</span>
            <span className="text-[10px] tracking-[0.15em] text-white/20 uppercase mt-1">&amp; Android</span>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="flex flex-col items-center gap-2 mt-8"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] tracking-[0.3em] text-white/15 uppercase">
            Scroll for details
          </span>
          <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.div>

      {/* ── Screenshot Gallery ── */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 mt-24 mx-auto max-w-7xl w-full"
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <h3 className="font-heading text-2xl font-bold text-white/50">
              App Snap
            </h3>
            <p className="text-xs text-white/20 mt-1">
              Check out the live app
            </p>
          </div>

          {/* Gallery nav arrows */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scrollGallery("left")}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/25 hover:text-white/50 hover:border-white/18 hover:bg-white/[0.03] transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => scrollGallery("right")}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/25 hover:text-white/50 hover:border-white/18 hover:bg-white/[0.03] transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal scroll gallery */}
        <div
          ref={galleryRef}
          className="flex overflow-x-auto overflow-y-hidden scrollbar-none py-8 -mx-3 snap-x snap-mandatory"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {screenshotPaths.map((src, index) => (
            <div key={src} className="snap-start">
              <div className="group">
                <ScreenshotCard src={src} index={index} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

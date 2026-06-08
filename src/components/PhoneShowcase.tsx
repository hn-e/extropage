"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function PhoneShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

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

      <motion.div
        style={{ opacity, y, scale }}
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
    </section>
  );
}

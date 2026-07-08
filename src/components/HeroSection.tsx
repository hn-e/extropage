"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function FloatingLabel({
  text,
  x,
  y,
  delay,
  duration,
}: {
  text: string;
  x: string;
  y: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none z-10"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
    >
      <motion.div
        className="glass-panel-pro rounded-full px-4 py-2 flex items-center gap-2"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.5,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
        <span className="text-[10px] tracking-[0.15em] text-white/40 uppercase font-mono">
          {text}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, 60]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden content-auto"
    >
      {/* Subtle center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0 bg-glow-radial animate-breathe" />

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 flex flex-col items-center gap-8 px-4 text-center max-w-4xl"
      >
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-8 bg-white/20" />
          <span className="font-mono text-xs tracking-[0.3em] text-white/40 uppercase">
            Himanshu Soni
          </span>
          <span className="h-px w-8 bg-white/20" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 1 }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight"
        >
          <span className="text-gradient-metallic">"Honey, I'm a dev."</span>
        </motion.h1>

        {/* Domain Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          style={{ y: textY }}
          className="mt-4"
        >
          <p className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white/20 tracking-tighter select-none">
            honey.is-a.dev
          </p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
      >
        <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase">
          Scroll
        </span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
          animate={{
            scaleY: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

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
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse-glow" />
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >

      {/* Gradient overlays */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/15 to-[#0a0a0a] pointer-events-none z-0" /> */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        // style={{
        //   background:
        //     "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.7) 100%)",
        // }}
      />
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
          <span className="text-gradient-metallic">Full-stack</span>
          <br />
          <span className="text-gradient-silver">Developer</span>
        </motion.h1>

        {/* Domain Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          style={{ y: textY }}
          className="mt-4"
        >
          <p className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white/5 tracking-tighter select-none">
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

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-6"
        >
          <button
            onClick={() => {
              const el = document.getElementById("projects");
              if (el) {
                const top =
                  el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
            className="group relative px-8 py-3 rounded-full overflow-hidden hoverable"
          >
            <span className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-all duration-500" />
            <span className="absolute inset-0 rounded-full bg-white/[0.03] group-hover:bg-white/[0.08] transition-all duration-500" />
            {/* Hover glow */}
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/[0.02] via-white/[0.04] to-white/[0.02]" />
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-white/[0.03]" />
            <span className="relative text-sm font-medium tracking-[0.05em] text-white/80 group-hover:text-white transition-colors duration-500">
              Explore Work
            </span>
          </button>

          <a
            href="#connect"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("connect");
              if (el) {
                const top =
                  el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
            className="group text-sm tracking-[0.05em] text-white/30 hover:text-white/60 transition-colors flex items-center gap-2 hoverable"
          >
            Get in Touch
            <svg
              className="w-3 h-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/50"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M3 9L9 3M9 3H5M9 3V7"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
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

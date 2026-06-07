"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroCanvas } from "./HeroCanvas";

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
      <HeroCanvas />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/20 to-[#0a0a0a] pointer-events-none z-0" />
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.6) 100%)' }} />

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
          <span className="text-gradient-silver">Building Products</span>
          <br />
          <span className="text-gradient">That Scale</span>
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

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="max-w-lg text-sm sm:text-base text-white/30 leading-relaxed"
        >
          Software Engineer & Full-Stack Developer. Creator of Extroverts
          (8K+ users) and Kitinit.com (27K+ users) — crafting production-grade
          web and mobile experiences that reach thousands.
        </motion.p>

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
                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
            className="group relative px-8 py-3 rounded-full overflow-hidden"
          >
            <span className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors duration-500" />
            <span className="absolute inset-0 rounded-full bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors duration-500" />
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
                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
            className="group text-sm tracking-[0.05em] text-white/30 hover:text-white/60 transition-colors flex items-center gap-2"
          >
            Get in Touch
            <svg
              className="w-3 h-3 transition-transform group-hover:translate-x-1"
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
          className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
          animate={{ scaleY: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

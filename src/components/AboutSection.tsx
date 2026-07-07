"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const skills = [
  "Python",
  "JavaScript",
  "React Native",
  "Next.js",
  "Laravel",
  "Django",
  "PHP",
  "AWS",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Docker",
  "Git",
  "TailwindCSS",
  "VueJS",
  "Flask",
];

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const xLeft = useTransform(scrollYProgress, [0, 0.6], [-60, 0]);
  const xRight = useTransform(scrollYProgress, [0, 0.6], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 1, 1]);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-32 px-6 overflow-hidden content-auto"
    >
      {/* Radial vignette — dampens background particles behind text */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 40%, rgba(10,10,10,0.6) 0%, transparent 65%)",
        }}
      />

      {/* Section Label */}
      <motion.div
        style={{ opacity }}
        className="mb-16 flex items-center gap-3"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-white/20 uppercase">
          01
        </span>
        <span className="h-px w-12 bg-gradient-to-r from-white/15 to-transparent" />
        <span className="font-mono text-xs tracking-[0.2em] text-white/30 uppercase">
          About
        </span>
      </motion.div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Bio */}
        <motion.div style={{ x: xLeft, opacity }} className="space-y-8">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-[1.05]">
            <span className="text-gradient-metallic">About</span>
          </h2>

          <div className="space-y-5 text-white/40 leading-relaxed">
            <p className="text-sm sm:text-base">
              I code mobile web etc
            </p>
          </div>

          {/* Decorative accents */}
          <div className="pt-4 flex items-center gap-3">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse-glow" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/8" />
            </div>
            <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
        </motion.div>

        {/* Right: Skills Grid + Cards */}
        <motion.div style={{ x: xRight, opacity }} className="space-y-6">
          {/* 3D Glass Card */}
          <div className="glass-border-neon glass-panel-pro rounded-2xl p-8 glow-neon hover-lift">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <h3 className="font-heading text-lg font-semibold text-white/70">
                  Skills
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-white/35 transition-all duration-300 hover:border-white/20 hover:text-white/70 hover:bg-white/[0.05] hover:shadow-[0_0_12px_rgba(255,255,255,0.04)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Currently */}
          <div className="glass-border glass-panel-pro rounded-2xl p-8 glow-pro hover-lift">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white/60" />
              </span>
              <span className="text-xs tracking-[0.15em] text-white/30 uppercase">
                Open to opportunities
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

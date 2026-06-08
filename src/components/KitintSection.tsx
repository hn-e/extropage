"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ──────────── App Info ──────────── */

const features = [
  "Scaffold projects in seconds",
  "Interactive CLI with smart prompts",
  "Built-in code generation & linting",
  "Open source & extensible via plugins",
];

const storeLinks = {
  npm: "https://www.npmjs.com/package/kitint",
  github: "https://github.com/kitint/kitint",
};

export function KitintSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [0, 1, 1]);
  const contentX = useTransform(scrollYProgress, [0.1, 0.4], [80, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  return (
    <section
      ref={containerRef}
      id="kitint"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background ambient glow — subtle green tint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none opacity-15">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 600px 400px at 50% 50%, rgba(74, 222, 128, 0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Section Label */}
      <motion.div
        style={{ opacity: sectionOpacity }}
        className="mb-16 flex items-center gap-3"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-white/20 uppercase">
          Featured
        </span>
        <span className="h-px w-12 bg-gradient-to-r from-white/15 to-transparent" />
        <span className="font-mono text-xs tracking-[0.2em] text-white/30 uppercase">
          Tool
        </span>
      </motion.div>

      {/* ── Main Two-Column Layout ── */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[600px]">
        {/* Left: Terminal display area — 3D terminal rendered by global background canvas */}
        <motion.div
          style={{ opacity: sectionOpacity }}
          className="relative h-[550px] sm:h-[650px] lg:h-[700px] order-2 lg:order-1"
        >
          {/* Subtle glow under where the terminal appears */}
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[300px] h-4 blur-3xl rounded-full pointer-events-none"
            style={{ background: "rgba(74, 222, 128, 0.03)" }}
          />
        </motion.div>

        {/* Right: Content */}
        <motion.div
          style={{ x: contentX, opacity: contentOpacity }}
          className="space-y-10 order-1 lg:order-2"
        >
          {/* App Name + Icon */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl border flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(74, 222, 128, 0.08), rgba(74, 222, 128, 0.02))",
                  borderColor: "rgba(74, 222, 128, 0.12)",
                  boxShadow: "0 0 30px rgba(74, 222, 128, 0.04)",
                }}
              >
                <span
                  className="font-mono text-xl font-bold"
                  style={{ color: "rgba(74, 222, 128, 0.5)" }}
                >
                  &gt;_
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-4xl sm:text-5xl font-bold">
                    <span className="text-gradient-metallic">Kitint</span>
                  </h2>
                  <span className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-0.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white/70" />
                    </span>
                    <span className="text-[9px] tracking-[0.15em] text-white/40 uppercase font-mono">
                      Live
                    </span>
                  </span>
                </div>
                <p className="text-sm text-white/30 mt-1">CLI Toolkit · Developer-first</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-base text-white/35 leading-relaxed max-w-md">
            A blazing-fast CLI toolkit for modern developers. Bootstrap
            projects, generate boilerplate, and automate your workflow —
            all from the terminal.
          </p>

          {/* Terminal snippet preview */}
          <div
            className="font-mono text-xs rounded-xl overflow-hidden"
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(74, 222, 128, 0.08)",
            }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              <span className="ml-2 text-[10px] text-white/20">kitint — zsh</span>
            </div>
            <div className="px-4 py-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <span style={{ color: "rgba(74, 222, 128, 0.5)" }}>$</span>
                <span className="text-white/45">npm create extropage</span>
              </div>
              <div className="text-white/20 pl-4">Scaffolding project...</div>
              <div className="text-white/20 pl-4">Installing dependencies...</div>
              <div className="flex items-center gap-2">
                <span style={{ color: "rgba(74, 222, 128, 0.5)" }}>$</span>
                <span className="text-white/25 animate-pulse" style={{ width: 8, height: 14, background: "rgba(74, 222, 128, 0.3)", display: "inline-block", borderRadius: 1 }} />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature}
                className="flex items-center gap-3 glass-border glass-panel-pro rounded-xl px-5 py-3.5 hoverable hover:bg-white/[0.04] transition-all duration-300"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(74, 222, 128, 0.35)" }}
                />
                <span className="text-sm text-white/45">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="glass-border glass-panel-pro rounded-2xl px-6 py-4 hoverable hover:bg-white/[0.04] transition-all duration-300">
              <div className="flex items-center gap-1.5 mb-1">
                <svg
                  className="w-3.5 h-3.5 opacity-40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="font-mono text-xl font-semibold text-white/70">
                  4.9k
                </span>
              </div>
              <span className="text-[10px] tracking-[0.1em] text-white/25 uppercase">
                GitHub stars
              </span>
            </div>

            <div className="glass-border glass-panel-pro rounded-2xl px-6 py-4 hoverable hover:bg-white/[0.04] transition-all duration-300">
              <span className="font-mono text-xl font-semibold text-white/70">
                120K+
              </span>
              <span className="text-[10px] tracking-[0.1em] text-white/25 ml-1">
                weekly downloads
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <a
              href={storeLinks.npm}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-border-neon glass-panel-pro rounded-xl px-5 py-3 flex items-center gap-3 hoverable hover:bg-white/[0.06] transition-all duration-500 group hover:glow-neon"
            >
              <svg className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <div className="text-left">
                <span className="block text-[9px] tracking-[0.1em] text-white/30 uppercase leading-tight">
                  Install via
                </span>
                <span className="block text-sm font-semibold text-white/60 group-hover:text-white/80 transition-colors leading-tight">
                  npm
                </span>
              </div>
            </a>

            <a
              href={storeLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-border-neon glass-panel-pro rounded-xl px-5 py-3 flex items-center gap-3 hoverable hover:bg-white/[0.06] transition-all duration-500 group hover:glow-neon"
            >
              <svg className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <div className="text-left">
                <span className="block text-[9px] tracking-[0.1em] text-white/30 uppercase leading-tight">
                  View on
                </span>
                <span className="block text-sm font-semibold text-white/60 group-hover:text-white/80 transition-colors leading-tight">
                  GitHub
                </span>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

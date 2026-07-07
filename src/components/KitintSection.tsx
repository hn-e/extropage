"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiPython,
  SiDocker,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiCloudflare,
  SiVercel,
  SiGit,
  SiFigma,
  SiGraphql,
  SiRust,
  SiVuedotjs,
  SiSvelte,
  SiPrisma,
  SiVite,
} from "react-icons/si";

/* ──────────── Icons ─────────────────────────────────────────────── */

const icons = [
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiPython,
  SiDocker,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiCloudflare,
  SiVercel,
  SiGit,
  SiFigma,
  SiGraphql,
  SiRust,
  SiVuedotjs,
  SiSvelte,
  SiPrisma,
  SiVite,
];

const TOTAL_CELLS = 60;
const COLS_LG = 12;
const COLS_SM = 8;
const COLS = 6;

const lineColors = [
  "rgba(74,222,128,0.9)",   // neon green
  "rgba(52,211,153,0.9)",   // emerald
  "rgba(96,165,250,0.9)",   // neon blue
  "rgba(167,139,250,0.9)",  // neon purple
  "rgba(244,114,182,0.9)",  // neon pink
  "rgba(250,204,21,0.85)",  // neon yellow
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ──────────── Terminal ───────────────────────────────────────────── */

const terminalLines = [
  { text: "$ kitint create my-app", delay: 0.3 },
  { text: "Generating project structure...", delay: 1.2 },
  { text: "Creating files — src/, public/, config/", delay: 2.0 },
  { text: "Installing dependencies  ████████████ 100%", delay: 2.8 },
  { text: "Project ready!  ✨", delay: 3.6 },
];

function Terminal() {
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    terminalLines.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisible(i + 1);
        if (i === terminalLines.length - 1) {
          setTimeout(() => setDone(true), 600);
        }
      }, terminalLines[i].delay * 1000);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto -mt-24 pb-20 px-6 z-[4]">
      <div
        className="font-mono text-xs rounded-xl overflow-hidden"
        style={{
          background: "rgba(0, 0, 0, 1)",
          border: "1px solid rgba(74, 222, 128, 0.10)",
          boxShadow: "0 0 60px rgba(74, 222, 128, 0.06)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
          <span className="ml-2 text-[10px] text-white/15">terminal — kitint</span>
        </div>

        {/* Terminal body */}
        <div className="px-4 py-4 space-y-2 text-left">
          {terminalLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={i < visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <span style={{ color: "rgba(74, 222, 128, 0.5)" }}>$</span>
              <span className={i === 0 ? "text-white/50" : "text-white/25"}>
                {line.text}
              </span>
            </motion.div>
          ))}

          {/* CTA Button */}
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center pt-4"
            >
              <a
                href="https://kitinit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/[0.10] bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 text-sm text-white/50 hover:text-white/70"
                style={{
                  boxShadow: "0 0 30px rgba(74, 222, 128, 0.08)",
                }}
              >
                Try Kitint
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M3 9L9 3M9 3H5M9 3V7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────── Section ───────────────────────────────────────────── */

export function KitintSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const sentinelInView = useInView(sentinelRef, { margin: "-0px 0px -300px 0px" });
  const [gridMounted, setGridMounted] = useState(false);

  useEffect(() => {
    if (sentinelInView) setGridMounted(true);
  }, [sentinelInView]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

  // Deterministic random chip placement
  const chipCells = useMemo(() => {
    const rand = seededRandom(42);
    const set = new Set<number>();
    while (set.size < 20) {
      set.add(Math.floor(rand() * TOTAL_CELLS));
    }
    return set;
  }, []);

  const chipIcons = useMemo(() => {
    const rand = seededRandom(77);
    const map = new Map<number, number>();
    for (const cell of chipCells) {
      map.set(cell, Math.floor(rand() * icons.length));
    }
    return map;
  }, [chipCells]);

  // Random connection pairs between chips
  const connections = useMemo(() => {
    const chips = Array.from(chipCells);
    const rand = seededRandom(91);
    const pairs: { a: number; b: number; color: string }[] = [];
    for (let i = 0; i < chips.length - 1 && pairs.length < 18; i++) {
      if (rand() > 0.55) continue;
      const b = chips[Math.floor(rand() * chips.length)];
      if (chips[i] !== b && !pairs.some((p) => (p.a === chips[i] && p.b === b) || (p.a === b && p.b === chips[i]))) {
        pairs.push({ a: chips[i], b, color: lineColors[Math.floor(rand() * lineColors.length)] });
      }
    }
    return pairs;
  }, [chipCells]);

  // Grid dimensions for SVG line positioning
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridW, setGridW] = useState(0);
  const [cols, setCols] = useState(COLS);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setGridW(w);
      setCols(w >= 1024 ? COLS_LG : w >= 640 ? COLS_SM : COLS);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cellCenter = (idx: number) => {
    const cw = gridW / cols;
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    return { x: (col + 0.5) * cw, y: (row + 0.5) * cw };
  };

  return (
    <section
      ref={containerRef}
      id="kitint"
      className="relative min-h-screen flex flex-col items-center pt-24 overflow-hidden content-auto"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[900px] pointer-events-none opacity-12">
        <div className="absolute inset-0 bg-glow-radial" />
      </div>

      <motion.div
        style={{
          opacity,
          y,
          scale,
          background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(10,10,10,0.6) 0%, transparent 70%)",
        }}
        className="relative z-10 flex flex-col items-center gap-10 text-center max-w-3xl pb-16 px-6"
      >
        {/* Section label */}
        <motion.div className="flex items-center gap-3">
          <span className="h-px w-8 bg-white/15" />
          <span className="font-mono text-xs tracking-[0.3em] text-white/30 uppercase">
            Featured Tool
          </span>
          <span className="h-px w-8 bg-white/15" />
        </motion.div>

        {/* App name */}
        <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
          <span className="text-gradient-metallic">Kitint</span>
        </h2>

        {/* Tagline */}
        <p className="text-base sm:text-lg text-white/25 max-w-md leading-relaxed">
          CLI Toolkit · Developer-first — scaffold, generate, automate
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <span className="block font-mono text-2xl font-semibold text-white/50">4.9k</span>
            <span className="text-[10px] tracking-[0.15em] text-white/20 uppercase mt-1">GitHub Stars</span>
          </div>
          <span className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <span className="block font-mono text-2xl font-semibold text-white/50">120K+</span>
            <span className="text-[10px] tracking-[0.15em] text-white/20 uppercase mt-1">Downloads</span>
          </div>
          <span className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <span className="block font-mono text-2xl font-semibold text-white/50">MIT</span>
            <span className="text-[10px] tracking-[0.15em] text-white/20 uppercase mt-1">License</span>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="flex flex-col items-center gap-2 mt-4"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] tracking-[0.3em] text-white/15 uppercase">
            Scroll for details
          </span>
          <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Sentinel — triggers grid mount when near viewport */}
      <div ref={sentinelRef} className="h-0 w-full" />

      {gridMounted && (
        <>
          {/* Grid — square cells, random glassmorph chips, glowing connections */}
          <div ref={gridRef} className="relative w-full bg-black grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12">
        {/* SVG orthogonal mind-map lines */}
        {gridW > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {connections.map(({ a, b, color }, i) => {
              const ca = cellCenter(a);
              const cb = cellCenter(b);
              // Orthogonal path: horizontal then vertical (or vice versa)
              const hFirst = i % 2 === 0;
              const d = hFirst
                ? `M ${ca.x} ${ca.y} Q ${cb.x} ${ca.y} ${cb.x} ${cb.y}`
                : `M ${ca.x} ${ca.y} Q ${ca.x} ${cb.y} ${cb.x} ${cb.y}`;
              const dur = 10 + (i % 5) * 2;
              return (
                <g key={i}>
                  {/* Outer glow */}
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.12}
                    style={{ filter: `blur(8px)` }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 1, 0] }}
                    transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  />
                  {/* Mid glow */}
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.35}
                    style={{ filter: `blur(3px)` }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 1, 0] }}
                    transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  />
                  {/* Core */}
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 1, 0] }}
                    transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                    style={{ filter: `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 6px ${color})` }}
                  />
                </g>
              );
            })}
          </svg>
        )}

        {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
          const hasChip = chipCells.has(i);
          const iconIdx = chipIcons.get(i);
          return (
            <div
              key={i}
              className="aspect-square flex items-center justify-center relative z-[2]"
            >
              {hasChip && iconIdx !== undefined && (() => {
                const Icon = icons[iconIdx];
                return (
                  <div className="w-3/5 aspect-square rounded-xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-2/5 h-2/5 text-white/25" />
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* ── Terminal ────────────────────────────────────────────────── */}
      <Terminal />
        </>
      )}

    </section>
  );
}

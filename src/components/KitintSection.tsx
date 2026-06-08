"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ──────────── Icons ─────────────────────────────────────────────── */

const icons = [
  <path key="a" d="M8 2L4 6l4 4M16 2l4 4-4 4M3 12h18" />,
  <path key="b" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
  <g key="c"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 12h8M12 8v8" /></g>,
  <path key="d" d="M5 12h14M12 5l7 7-7 7" />,
  <g key="e"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></g>,
  <path key="f" d="M7 7h10l-5 10V7" />,
  <path key="g" d="M4 4l7 7-7 7M13 4l7 7-7 7" />,
  <g key="h"><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></g>,
  <path key="i" d="M2 8h20M2 16h20M8 2v20M16 2v20" />,
  <path key="j" d="M12 2L2 22h20L12 2z" />,
  <g key="k"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></g>,
  <path key="l" d="M12 2a10 10 0 0 1 0 20M12 2a10 10 0 0 0 0 20M2 12h20" />,
];

const TOTAL_CELLS = 96;
const COLS_LG = 12;
const COLS_SM = 8;
const COLS = 6;

const lineColors = [
  "rgba(255,255,255,0.12)",
  "rgba(74,222,128,0.15)",
  "rgba(96,165,250,0.15)",
  "rgba(192,132,252,0.15)",
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ──────────── Section ───────────────────────────────────────────── */

export function KitintSection() {
  const containerRef = useRef<HTMLDivElement>(null);

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
    while (set.size < 30) {
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
      className="relative min-h-screen flex flex-col items-center pt-24 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[900px] pointer-events-none opacity-12">
        <div className="absolute inset-0 bg-glow-radial" />
      </div>

      {/* Radial vignette — dark center behind text */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 40%, rgba(10,10,10,0.55) 0%, transparent 70%)",
        }}
      />

      <motion.div
        style={{ opacity, y, scale }}
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

      {/* Grid — square cells, random glassmorph chips, glowing connections */}
      <div ref={gridRef} className="relative w-full grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12">
        {/* SVG orthogonal mind-map lines */}
        {gridW > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {connections.map(({ a, b, color }, i) => {
              const ca = cellCenter(a);
              const cb = cellCenter(b);
              // Orthogonal path: horizontal then vertical (or vice versa)
              const hFirst = i % 2 === 0;
              const d = hFirst
                ? `M ${ca.x} ${ca.y} L ${cb.x} ${ca.y} L ${cb.x} ${cb.y}`
                : `M ${ca.x} ${ca.y} L ${ca.x} ${cb.y} L ${cb.x} ${cb.y}`;
              const dur = 2.5 + (i % 3) * 0.6;
              return (
                <g key={i}>
                  {/* Glow layer */}
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.25}
                    style={{ filter: `blur(4px)` }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 1, 0] }}
                    transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  />
                  {/* Core line */}
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
                    style={{ filter: `drop-shadow(0 0 8px ${color})` }}
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
              className="aspect-square border border-white/[0.04] flex items-center justify-center"
            >
              {hasChip && iconIdx !== undefined && (
                <div className="w-3/5 aspect-square rounded-xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-sm flex items-center justify-center">
                  <svg
                    className="w-2/5 h-2/5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={1.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {icons[iconIdx]}
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

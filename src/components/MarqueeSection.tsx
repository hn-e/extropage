"use client";

import { motion } from "framer-motion";

const rows = [
  ["React", "Python", "Laravel", "Next.js", "Node", "Django", "Flask", "VueJS"],
  ["AWS", "Docker", "PostgreSQL", "Redis", "MySQL", "Git", "Bash", "REST"],
  ["iOS", "Android", "Extroverts", "Kitinit", "Ship", "Scale", "Googling", "Debug"],
];

function MarqueeRow({ words, row }: { words: string[]; row: number }) {
  const doubled = [...words, ...words];
  return (
    <motion.div
      className="flex items-center gap-6 whitespace-nowrap"
      animate={{ x: row % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{
        x: { duration: 20, repeat: Infinity, ease: "linear" },
      }}
    >
      {doubled.map((word, i) => (
        <span key={`${word}-${i}`} className="flex items-center gap-6">
          <span
            className={`font-heading text-[10vw] md:text-[7vw] font-bold leading-none ${
              i % 2 === 0 ? "text-white/60" : "text-white/10"
            }`}
            style={{
              WebkitTextStroke: i % 2 === 0 ? "none" : "1px rgba(255,255,255,0.15)",
            }}
          >
            {word}
          </span>
          <span
            className="font-mono text-[1.5vw] md:text-[1vw] text-white/10 tracking-[0.3em] uppercase select-none shrink-0"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              WebkitTextStroke: "none",
            }}
          >
            honey.is-a.dev
          </span>
        </span>
      ))}
    </motion.div>
  );
}

export function MarqueeSection() {
  return (
    <section
      data-cursor-hover
      data-cursor-size="150"
      className="relative h-screen flex flex-col justify-center overflow-hidden bg-[#0a0a0a] border-t border-white/[0.04]"
    >
      {rows.map((words, i) => (
        <MarqueeRow key={i} words={words} row={i} />
      ))}
    </section>
  );
}

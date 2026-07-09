"use client";

import { motion } from "framer-motion";

const words = ["Performance", "UI", "Modern", "Code", "Speed", "Books"];

export function MarqueeSection() {
  return (
    <section
      data-cursor-hover
      data-cursor-size="150"
      className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] border-t border-white/[0.04]"
    >
      <div className="w-full">
        {[...Array(2)].map((_, row) => (
          <motion.div
            key={row}
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: row === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
            transition={{
              x: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            {[...words, ...words].map((word, i) => (
              <span
                key={`${word}-${i}`}
                className={`font-heading text-[12vw] md:text-[10vw] font-bold leading-none ${
                  i % 2 === 0 ? "text-white/60" : "text-white/10"
                }`}
                style={{ WebkitTextStroke: i % 2 === 0 ? "none" : "1px rgba(255,255,255,0.15)" }}
              >
                {word}
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

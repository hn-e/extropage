"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function KitintSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const fadeIn = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const slideRight = useTransform(scrollYProgress, [0.15, 0.4], [-40, 0]);
  const slideLeft = useTransform(scrollYProgress, [0.15, 0.4], [40, 0]);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install kitinit");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]"
    >
      <div className="mx-auto max-w-6xl w-full px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: headline + description */}
        <motion.div
          style={{ opacity: fadeIn, x: slideRight }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-white/15" />
            <span className="font-mono text-xs tracking-[0.3em] text-white/30 uppercase">
              Featured Tool
            </span>
          </div>

          <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold">
            <span className="text-gradient-metallic">Kitinit</span>
          </h2>

          <p className="text-lg text-white/35 leading-relaxed max-w-md">
            Zero-config full-stack project generator. Pick your stack — we
            ship the boilerplate.
          </p>

          <div className="flex items-center gap-6 pt-4">
            <div className="text-center">
              <span className="block font-mono text-2xl font-semibold text-white/50">
                27K+
              </span>
              <span className="text-[10px] tracking-[0.15em] text-white/25 uppercase mt-1">
                Users
              </span>
            </div>
            <span className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <span className="block font-mono text-2xl font-semibold text-white/50">
                Zero
              </span>
              <span className="text-[10px] tracking-[0.15em] text-white/25 uppercase mt-1">
                Config
              </span>
            </div>
            <span className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <span className="block font-mono text-2xl font-semibold text-white/50">
                FOSS
              </span>
              <span className="text-[10px] tracking-[0.15em] text-white/25 uppercase mt-1">
                Free
              </span>
            </div>
          </div>

          <a
            href="https://kitinit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/50 hover:text-white/80 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500"
          >
            kitinit.com
            <svg
              className="w-3 h-3"
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

        {/* Right: npm install block */}
        <motion.div
          style={{ opacity: fadeIn, x: slideLeft }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              boxShadow: "0 0 60px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-2 px-5 py-3"
              style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
            >
              <span className="w-3 h-3 rounded-full bg-red-500/30" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/30" />
              <span className="w-3 h-3 rounded-full bg-green-500/30" />
              <span className="ml-2 font-mono text-[11px] text-white/20">
                terminal
              </span>
            </div>

            {/* Terminal content */}
            <div className="p-5 sm:p-6 font-mono text-sm leading-relaxed space-y-2">
              <div className="text-white/25">
                <span className="text-green-400/60">$</span>{" "}
                npm install kitinit
              </div>
              <div className="text-white/15 text-xs">
                added 142 packages in 4s
              </div>
              <div className="text-white/15 text-xs">
                27k packages are looking for funding
              </div>
              <div className="text-white/15 text-xs">
                run <span className="text-amber-400/60">`npx kitinit`</span>{" "}
                to create a new project
              </div>

              <div className="pt-3 text-white/30">
                <span className="text-green-400/60">$</span>{" "}
                npx kitinit my-app
              </div>
              <div className="text-white/15 text-xs">
                Pick your stack &rarr; Next.js · Tailwind · Prisma · Stripe{" "}
                <span className="text-white/20">✓</span>
              </div>
              <div className="text-white/15 text-xs animate-pulse">
                Generating project structure{" "}
                <span className="text-white/25">...</span>
              </div>
              <div className="text-green-400/50 text-xs pt-1">
                ✨ Project ready! Ship it.
              </div>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="absolute top-3 right-4 flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[10px] text-white/30 hover:text-white/60 hover:bg-white/[0.05] hover:border-white/[0.15] transition-all"
            >
              {copied ? (
                <>
                  <svg className="w-3 h-3 text-green-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copy
                </>
              )}
            </button>

            {/* Glow accent */}
            <div
              className="absolute -bottom-20 -right-20 w-40 h-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

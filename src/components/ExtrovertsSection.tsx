"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const storeLinks = {
  appStore:
    "https://apps.apple.com/us/app/extroverts-party-hangout-vibe/id6746046462",
  playStore:
    "https://play.google.com/store/apps/details?id=com.pro.nubpack",
};

export function ExtrovertsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const fadeIn = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  return (
    <section
      ref={containerRef}
      id="extroverts"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Breathing animated gradient bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0a0a1a, #140a2e, #0d0d2b, #15091f, #0a0a1a)",
          backgroundSize: "400% 400%",
          animation: "hero-breathe 22s ease-in-out infinite",
        }}
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Line 1: white text, gradient question mark */}
        <motion.h1
          style={{ opacity: fadeIn }}
          className="select-none text-4xl font-black uppercase leading-[0.9] text-white sm:text-5xl md:text-7xl lg:text-[5.5rem]"
        >
          No plans for
          <br />
          the night
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            ?
          </span>
        </motion.h1>

        {/* Line 2: full gradient text */}
        <motion.h1
          style={{ opacity: fadeIn }}
          className="mt-3 select-none bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-4xl font-black uppercase leading-[0.9] text-transparent sm:text-5xl md:text-7xl lg:text-[5.5rem]"
        >
          You got me
          <span className="text-amber-400">.</span>
        </motion.h1>

        {/* CTA button */}
        <motion.a
          href="https://extroverts.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ opacity: fadeIn }}
          className="group relative z-20 mt-14 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-8 py-3.5 text-sm uppercase tracking-[0.2em] text-white shadow-lg shadow-violet-500/25 transition-all duration-500 hover:scale-[1.03] hover:shadow-xl hover:shadow-violet-500/40"
        >
          visit extroverts.app
          <span className="text-lg transition-transform duration-300 group-hover:translate-y-0.5">
            &rarr;
          </span>
        </motion.a>

        {/* Store badges */}
        <motion.div
          style={{ opacity: fadeIn }}
          className="flex items-center gap-4 mt-8"
        >
          <a
            href={storeLinks.appStore}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-4 py-2.5 flex items-center gap-2.5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500"
          >
            <svg className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span className="text-[11px] font-medium text-white/60">App Store</span>
          </a>

          <a
            href={storeLinks.playStore}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-4 py-2.5 flex items-center gap-2.5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500"
          >
            <svg className="w-4 h-4 text-white/50" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.993l-2.302 2.302L5.864 2.658z" />
            </svg>
            <span className="text-[11px] font-medium text-white/60">Google Play</span>
          </a>
        </motion.div>

        {/* Spotlight CTA */}
        <motion.a
          href="mailto:himanshu@extroverts.app"
          style={{ opacity: fadeIn }}
          className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm px-5 py-3 text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-300"
        >
          <span className="text-white/60">Own a party hotspot?</span>{" "}
          Get it into <span className="text-violet-400/60">SPOTLIGHT</span>{" "}
          &mdash;{" "}
          <span className="text-white/40 underline underline-offset-2">
            himanshu@extroverts.app
          </span>
        </motion.a>
      </div>

      <style jsx>{`
        @keyframes hero-breathe {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }
      `}</style>
    </section>
  );
}

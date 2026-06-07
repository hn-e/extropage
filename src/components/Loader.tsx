"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setVisible(false), 600);
          return 100;
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="relative flex flex-col items-center gap-8">
            {/* 3D Progress Ring */}
            <svg
              className="w-24 h-24 -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1.5"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="url(#loaderGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
                initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - progress / 100) }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
              <defs>
                <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Percentage */}
            <div className="text-center">
              <motion.span
                className="font-mono text-3xl tracking-wider text-white/80 tabular-nums"
                key={Math.floor(progress)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.08 }}
              >
                {Math.floor(progress)}
              </motion.span>
              <span className="font-mono text-lg text-white/30">%</span>
            </div>

            {/* Branding */}
            <motion.p
              className="font-heading text-xs uppercase tracking-[0.3em] text-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              honey.is-a.dev
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
          {/* Background radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none">
            <div className="absolute inset-0 bg-glow-radial animate-breathe" />
          </div>

          <div className="relative flex flex-col items-center gap-8">
            {/* Progress Ring */}
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full blur-xl bg-white/[0.02] scale-150" />

              <svg
                className="w-28 h-28 -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background track */}
                <circle
                  cx="50"
                  cy="50"
                  r="43"
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1.5"
                />

                {/* Progress arc */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="43"
                  fill="none"
                  stroke="url(#loaderGradient)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 43}`}
                  strokeDashoffset={2 * Math.PI * 43 * (1 - progress / 100)}
                  initial={{ strokeDashoffset: 2 * Math.PI * 43 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 43 * (1 - progress / 100),
                  }}
                  transition={{ duration: 0.1, ease: "linear" }}
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(255,255,255,0.15))",
                  }}
                />

                {/* Leading dot */}
                <motion.circle
                  cx="50"
                  cy="7"
                  r="2.5"
                  fill="rgba(255,255,255,0.9)"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))",
                  }}
                  animate={{
                    rotate:
                      progress > 0
                        ? (360 * progress) / 100
                        : 0,
                  }}
                  transition={{ duration: 0.1, ease: "linear" }}
                  transformOrigin="50 50"
                />

                <defs>
                  <linearGradient
                    id="loaderGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                    <stop offset="30%" stopColor="rgba(255,255,255,0.6)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
                    <stop offset="70%" stopColor="rgba(255,255,255,0.6)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Percentage */}
            <div className="text-center">
              <motion.span
                className="font-mono text-4xl font-light tracking-wider text-white/80 tabular-nums"
                key={Math.floor(progress)}
                initial={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.15 }}
              >
                {Math.floor(progress)}
              </motion.span>
              <span className="font-mono text-xl text-white/25">%</span>
            </div>

            {/* Loading bar */}
            <div className="w-48 h-px bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-white/20 via-white/50 to-white/20 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            {/* Branding */}
            <motion.p
              className="font-heading text-xs uppercase tracking-[0.3em] text-white/15"
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

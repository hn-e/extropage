"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/himanshu",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/himanshu",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com/himanshu",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:himanshoni@gmail.com",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

function MagneticLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 p-3 group"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="text-white/15 group-hover:text-white/70 transition-colors duration-300">
        {icon}
      </span>
      <span className="text-[10px] tracking-[0.15em] text-white/15 group-hover:text-white/40 uppercase transition-colors duration-300">
        {label}
      </span>
    </motion.a>
  );
}

export function ConnectSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 1, 1]);

  return (
    <section
      ref={containerRef}
      id="connect"
      className="relative py-32 px-6 overflow-hidden content-auto"
    >
      {/* Radial vignette — dampens background particles behind text */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 40%, rgba(10,10,10,0.6) 0%, transparent 65%)",
        }}
      />

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-30">
        <div className="absolute inset-0 rounded-full border border-white/[0.02] animate-spin-slow" />
        <div className="absolute inset-8 rounded-full border border-white/[0.03] animate-spin-slow [animation-direction:reverse] [animation-duration:15s]" />
        <div className="absolute inset-16 rounded-full border border-white/[0.02] animate-spin-slow [animation-duration:10s]" />
      </div>

      {/* Section Label */}
      <motion.div
        style={{ opacity }}
        className="mb-16 flex items-center gap-3"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-white/20 uppercase">
          04
        </span>
        <span className="h-px w-12 bg-gradient-to-r from-white/15 to-transparent" />
        <span className="font-mono text-xs tracking-[0.2em] text-white/30 uppercase">
          Connect
        </span>
      </motion.div>

      <motion.div style={{ opacity }} className="mx-auto max-w-4xl text-center relative z-10">
        {/* Decorative rings */}
        <div className="relative w-32 h-32 mx-auto mb-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/[0.06] animate-spin-slow" />
          <div className="absolute inset-3 rounded-full border border-white/[0.04] animate-spin-slow [animation-direction:reverse] [animation-duration:8s]" />
          <div className="absolute inset-6 rounded-full border border-white/[0.05] animate-spin-slow [animation-duration:6s]" />
          <div className="w-3 h-3 rounded-full bg-white/15 animate-pulse-glow shadow-[0_0_16px_rgba(255,255,255,0.12)]" />
        </div>

        <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
          <span className="text-gradient-metallic">Get in Touch</span>
        </h2>

        <p className="text-sm sm:text-base text-white/25 max-w-md mx-auto leading-relaxed mb-12">
          Open to projects and collaborations.
        </p>

        {/* CTA */}
        <a
          href="mailto:himanshoni@gmail.com"
          className="inline-flex items-center gap-3 group px-8 py-3 rounded-full glass-border-neon glass-panel-pro hover:bg-white/[0.06] transition-all duration-500 mb-16 hoverable glow-neon hover:glow-neon-intense"
        >
          <span className="text-sm font-medium tracking-[0.05em] text-white/70 group-hover:text-white transition-colors">
            himanshoni@gmail.com
          </span>
          <svg
            className="w-3 h-3 text-white/30 group-hover:text-white/70 transition-all duration-300 group-hover:translate-x-1"
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

        {/* Decorative orbit rings */}
        <div className="mb-16 flex justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border border-white/[0.04] animate-spin-slow" />
            <div className="absolute inset-3 rounded-full border border-white/[0.06] animate-spin-slow [animation-direction:reverse] [animation-duration:8s]" />
            <div className="absolute inset-6 rounded-full border border-white/[0.03] animate-spin-slow [animation-duration:6s]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white/25 animate-pulse-glow shadow-[0_0_10px_rgba(255,255,255,0.15)]" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-6">
          {socialLinks.map((link) => (
            <MagneticLink
              key={link.label}
              href={link.href}
              label={link.label}
              icon={link.icon}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-white/[0.04]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] tracking-[0.2em] text-white/15 uppercase">
              &copy; {new Date().getFullYear()} Himanshu Soni
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

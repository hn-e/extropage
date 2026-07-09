"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/himanshu",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/himanshu",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com/himanshu",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:himanshoni@gmail.com",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export function ConnectSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.4], [0, 1, 1]);
  const slideLeft = useTransform(scrollYProgress, [0.1, 0.3], [-40, 0]);
  const slideRight = useTransform(scrollYProgress, [0.1, 0.3], [40, 0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      ref={containerRef}
      id="connect"
      className="relative min-h-screen flex items-center py-24 px-6 overflow-hidden"
    >
      {/* Section Label */}
      <motion.div
        style={{ opacity }}
        className="absolute top-16 left-6 md:left-12 flex items-center gap-3"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-white/20 uppercase">04</span>
        <span className="h-px w-12 bg-gradient-to-r from-white/15 to-transparent" />
        <span className="font-mono text-xs tracking-[0.2em] text-white/30 uppercase">Connect</span>
      </motion.div>

      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Image */}
        <motion.div
          style={{ opacity, x: slideLeft }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm" />
            <Image
              src="/assets/himanshu.png"
              alt="Himanshu Soni"
              width={600}
              height={750}
              className="relative w-full h-auto rounded-2xl"
              priority
            />
            {/* Subtle glow behind image */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-glow-radial opacity-40 pointer-events-none" />
          </div>
        </motion.div>

        {/* Right: Form + info */}
        <motion.div
          style={{ opacity, x: slideRight }}
          className="space-y-8 order-1 lg:order-2"
        >
          <div>
            <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold">
              <span className="text-gradient-metallic">Get in Touch</span>
            </h2>
            <p className="mt-4 text-base text-white/30 leading-relaxed">
              Got a project, an idea, or just want to say hi? Drop a message.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Your name"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 text-base text-white/70 placeholder-white/20 outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all duration-300"
              />
              <input
                type="email"
                placeholder="Your email"
                required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 text-base text-white/70 placeholder-white/20 outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all duration-300"
              />
            </div>
            <textarea
              placeholder="What's on your mind?"
              rows={5}
              required
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 text-base text-white/70 placeholder-white/20 outline-none resize-none focus:border-white/20 focus:bg-white/[0.04] transition-all duration-300"
            />
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-10 py-4 text-base font-medium text-white/60 hover:text-white/90 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500"
            >
              {submitted ? (
                <>
                  <svg className="w-5 h-5 text-green-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Message sent!
                </>
              ) : (
                <>
                  Send Message
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M3 9L9 3M9 3H5M9 3V7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-6 pt-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/15 hover:text-white/60 transition-colors duration-300"
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                title={link.label}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 px-6 md:px-12">
        <div className="mx-auto max-w-6xl pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-[0.2em] text-white/15 uppercase">
            &copy; {new Date().getFullYear()} Himanshu Soni
          </p>
          <p className="text-[10px] tracking-[0.15em] text-white/10">
            Built with Next.js · Three.js · Too much coffee
          </p>
        </div>
      </div>
    </section>
  );
}

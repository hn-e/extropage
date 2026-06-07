"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Connect", href: "#connect" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
    >
      <nav
        className={`mx-auto max-w-5xl rounded-2xl transition-all duration-500 ${
          scrolled
            ? "glass-panel px-6 py-3"
            : "bg-transparent px-6 py-3"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="font-heading text-sm font-bold tracking-[0.2em] text-white/80 uppercase transition-colors hover:text-white"
          >
            honey
          </a>

          {/* Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className={`relative px-4 py-2 text-xs font-medium tracking-[0.1em] uppercase transition-colors ${
                  activeSection === link.href.replace("#", "")
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {link.label}
                {activeSection === link.href.replace("#", "") && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-4 right-4 h-[1px] bg-white/30"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              const el = document.getElementById("connect");
              if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
            className="hidden md:flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium tracking-[0.1em] text-white/60 uppercase transition-all hover:border-white/20 hover:text-white/90 hover:bg-white/[0.03]"
          >
            <span>Resume</span>
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 10L10 2M10 2H4M10 2V8"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Mobile Menu Dots */}
          <div className="flex md:hidden items-center gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeSection === link.href.replace("#", "")
                    ? "bg-white w-4"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}

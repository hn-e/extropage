"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const items = [
  { title: "Extroverts", sub: "8K+ users · 100+ 5★" },
  { title: "Kitinit", sub: "27K+ devs · Zero config" },
  { title: "Collabiora", sub: "HIPAA · Mayo Clinic backed" },
  { title: "Face Detection", sub: "7K+ assessments/mo" },
  { title: "Geeekd", sub: "Current · Fullstack" },
];

export function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);

  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const totalScrollable = rect.height - vh;

    if (totalScrollable <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
    const totalSlides = items.length;
    const viewportWidth = window.innerWidth;
    const maxTranslate = -(totalSlides - 1) * viewportWidth;

    setTranslateX(progress * maxTranslate);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${items.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {items.map((item) => (
            <div
              key={item.title}
              className="flex-shrink-0 w-screen h-screen border border-white/[0.06] bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 p-8 text-center"
            >
              <span className="font-mono text-xs tracking-[0.3em] text-white/20 uppercase">
                Project
              </span>
              <h3 className="font-heading text-5xl md:text-7xl font-bold text-white/80">
                {item.title}
              </h3>
              <p className="text-base text-white/30">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

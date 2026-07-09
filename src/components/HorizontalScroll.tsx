"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const items = [
  {
    text: "I create mobile\ncross-platform apps.",
    sub: "One codebase. Two stores. Zero native headaches.",
    img: "https://images.unsplash.com/photo-1712555000742-84faee058b5e?q=80&w=1170&auto=format&fit=crop",
  },
  {
    text: "I create full-stack\nwebsites.",
    sub: "From database to deployment. I'm the entire IT department.",
    img: "https://images.unsplash.com/photo-1651741304929-71bcb4d17c92?q=80&w=1170&auto=format&fit=crop",
  },
  {
    text: "I'm a design-first\ndeveloper.",
    sub: "Pretty pixels that actually work. Shocking, I know.",
    img: "https://images.unsplash.com/photo-1676022763096-a1ad12b2e370?q=80&w=1632&auto=format&fit=crop",
  },
  {
    text: "Googling is my\nprimary skill.",
    sub: "Listed on my resume. HR didn't notice. You did.",
    img: "https://images.unsplash.com/photo-1760008486599-e62d30e2ca95?q=80&w=1632&auto=format&fit=crop",
  },
];

export function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
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
    const viewportWidth = window.innerWidth;
    const maxTranslate = -(items.length - 1) * viewportWidth;

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
          className="flex will-change-transform"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {items.map((item) => (
            <div
              key={item.text}
              className="flex-shrink-0 w-screen h-screen border border-white/[0.06] flex flex-col justify-end p-8 sm:p-12 md:p-20 relative overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.img})` }}
              />
              <div className="absolute inset-0 bg-black/60" />
              <h2 className="relative z-10 font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white/80 leading-[1.05] whitespace-pre-line max-w-3xl">
                {item.text}
              </h2>
              <p className="relative z-10 mt-4 sm:mt-6 text-sm md:text-base text-white/25 tracking-[0.03em] max-w-xl">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

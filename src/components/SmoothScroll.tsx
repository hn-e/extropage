"use client";

import { useEffect, useRef, ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let current = 0;
    let target = 0;
    const ease = 0.08;

    const setHeight = () => {
      if (containerRef.current) {
        document.body.style.height = `${containerRef.current.scrollHeight}px`;
      }
    };

    const smoothScroll = () => {
      current += (target - current) * ease;
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(0, ${-current}px, 0)`;
      }
      rafId = requestAnimationFrame(smoothScroll);
    };

    const onScroll = () => {
      target = window.scrollY;
    };

    // Defer initial height calc to ensure content (including R3F) is rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(setHeight);
    });

    onScroll();
    smoothScroll();

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(setHeight);
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", setHeight);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setHeight);
      document.body.style.height = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full will-change-transform"
      style={{ pointerEvents: "auto" }}
    >
      {children}
    </div>
  );
}

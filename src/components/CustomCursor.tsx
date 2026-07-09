"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface TrailDot {
  id: number;
  x: number;
  y: number;
}

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverSize, setHoverSize] = useState(56);
  const [isTouch, setIsTouch] = useState(false);
  const [trails, setTrails] = useState<TrailDot[]>([]);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailIdRef = useRef(0);

  const springX = useSpring(cursorX, { stiffness: 250, damping: 25, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 250, damping: 25, mass: 0.5 });

  const ringSpringX = useSpring(cursorX, { stiffness: 120, damping: 20, mass: 0.8 });
  const ringSpringY = useSpring(cursorY, { stiffness: 120, damping: 20, mass: 0.8 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);

      trailIdRef.current += 1;
      const id = trailIdRef.current;
      setTrails((prev) => {
        const next = [...prev, { id, x: e.clientX, y: e.clientY }];
        if (next.length > 12) return next.slice(-12);
        return next;
      });
      setTimeout(() => {
        setTrails((prev) => prev.filter((t) => t.id !== id));
      }, 600);
    },
    [cursorX, cursorY]
  );

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(isTouchDevice);

    if (isTouchDevice) return;

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    const handleHoverStart = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const size = target.getAttribute("data-cursor-size");
      setHoverSize(size ? parseInt(size, 10) : 56);
      setIsHovering(true);
    };
    const handleHoverEnd = () => {
      setIsHovering(false);
      setHoverSize(56);
    };

    const hoverables = document.querySelectorAll(
      'a, button, [data-cursor-hover], input, textarea, [role="button"], .hoverable'
    );
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    const observer = new MutationObserver(() => {
      const newHoverables = document.querySelectorAll(
        'a, button, [data-cursor-hover], input, textarea, [role="button"], .hoverable'
      );
      newHoverables.forEach((el) => {
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  if (isTouch) return null;

  return (
    <>
      {/* Trail dots */}
      {trails.map((dot, i) => (
        <motion.div
          key={dot.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          initial={{ x: dot.x - 2, y: dot.y - 2, scale: 1, opacity: 0.6 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            boxShadow: "0 0 6px rgba(255,255,255,0.1)",
          }}
        />
      ))}

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: ringSpringX,
          y: ringSpringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? hoverSize : 36,
            height: isHovering ? hoverSize : 36,
            borderColor: isHovering
              ? "rgba(255,255,255,0.3)"
              : "rgba(255,255,255,0.12)",
            boxShadow: isHovering
              ? "0 0 20px rgba(255,255,255,0.08), 0 0 40px rgba(255,255,255,0.04)"
              : "0 0 12px rgba(255,255,255,0.03)",
          }}
          transition={{
            width: { type: "spring", stiffness: 300, damping: 25 },
            height: { type: "spring", stiffness: 300, damping: 25 },
          }}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        />
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            boxShadow:
              "0 0 8px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.2), 0 0 40px rgba(255,255,255,0.1)",
          }}
        />
      </motion.div>
    </>
  );
}

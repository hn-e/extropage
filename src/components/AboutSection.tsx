"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const skills = [
  "Python",
  "JavaScript",
  "React Native",
  "Next.js",
  "Laravel",
  "Django",
  "PHP",
  "AWS",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Docker",
  "Git",
  "TailwindCSS",
  "VueJS",
  "Flask",
];

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const xLeft = useTransform(scrollYProgress, [0, 0.6], [-60, 0]);
  const xRight = useTransform(scrollYProgress, [0, 0.6], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 1, 1]);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Section Label */}
      <motion.div
        style={{ opacity }}
        className="mb-16 flex items-center gap-3"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-white/20 uppercase">
          01
        </span>
        <span className="h-px w-12 bg-white/10" />
        <span className="font-mono text-xs tracking-[0.2em] text-white/30 uppercase">
          About
        </span>
      </motion.div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Bio */}
        <motion.div style={{ x: xLeft, opacity }} className="space-y-8">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-[1.05]">
            <span className="text-gradient-silver">Builder</span>
            <br />
            <span className="text-white/80">of Digital Products</span>
          </h2>

          <div className="space-y-5 text-white/40 leading-relaxed">
            <p className="text-sm sm:text-base">
              I&apos;m a full-stack developer and product engineer with a B.S.
              in Programming &amp; Data Science from IIT Madras (8.1 CGPA).
              I build software that real people use — my self-owned products
              Extroverts and Kitinit.com serve over 35,000 users combined.
            </p>
            <p className="text-sm sm:text-base">
              From cross-platform mobile apps to full-stack web platforms and
              AI-powered assessment tools, I ship production-grade software
              across the entire stack. My work spans React Native, Next.js,
              Laravel, Django, and AWS — always focused on craft, performance,
              and user experience.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { value: "8K+", label: "Extroverts" },
              { value: "27K+", label: "Kitinit Users" },
              { value: "8.1", label: "IITM CGPA" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-3xl font-bold text-white/80">
                  {stat.value}
                </div>
                <div className="text-[10px] tracking-[0.2em] text-white/20 uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Skills Grid + 3D Card */}
        <motion.div style={{ x: xRight, opacity }} className="space-y-8">
          {/* 3D Glass Card */}
          <div className="glass-border glass-panel rounded-2xl p-8 glow">
            <div className="space-y-6">
              <h3 className="font-heading text-lg font-semibold text-white/70">
                Core Competencies
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white/40 transition-all hover:border-white/15 hover:text-white/70 hover:bg-white/[0.04]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Philosophy Quote */}
          <div className="glass-panel rounded-2xl p-8 glow">
            <blockquote className="space-y-3">
              <svg
                className="w-6 h-6 text-white/10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
              </svg>
              <p className="text-sm sm:text-base text-white/30 italic leading-relaxed">
                I don&apos;t just write code — I ship products. Every project I
                build is designed to reach real users and make a measurable impact.
              </p>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

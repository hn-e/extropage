"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Experience {
  company: string;
  role: string;
  period: string;
  achievements: string[];
}

const experiences: Experience[] = [
  {
    company: "Geeekd, Delhi",
    role: "Software Engineer",
    period: "FEB 2024 — PRESENT",
    achievements: [
      "Built fullstack software products using JavaScript, PHP (Laravel), and Python",
      "Developed AI-powered face detection proctoring system handling 7,000+ assessments/month",
      "Practiced AWS infrastructure and open-source software development",
    ],
  },
  {
    company: "Humanity Founders, Remote",
    role: "Mobile Engineer",
    period: "AUG 2025 — MAR 2026",
    achievements: [
      "Built production-level cross-platform mobile apps for US-based clients",
      "Managed Apple App Store Connect and Google Play Console for client deployments",
      "Developed Collabiora — HIPAA-compliant health research app backed by Mayo Clinic",
    ],
  },
  {
    company: "SymphonyAI, Bengaluru",
    role: "Software Developer Intern",
    period: "APR 2023 — SEP 2023",
    achievements: [
      "Developed backend interfaces and accomplished .NET development tasks",
      "Tested and optimized application performance for enterprise software products",
      "Collaborated with senior engineers on production deployment pipelines",
    ],
  },
  {
    company: "IIT Madras, Chennai",
    role: "B.S. Programming & Data Science",
    period: "2019 — 2023",
    achievements: [
      "Graduated with 8.1 CGPA in Programming and Data Science",
      "Earned diplomas in Programming (2022) and Data Science (2023)",
      "Featured in IITM Topper's Interaction on IITM YouTube & LinkedIn (2025)",
    ],
  },
];

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 1, 1]);

  return (
    <section
      ref={containerRef}
      id="experience"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Section Label */}
      <motion.div
        style={{ opacity }}
        className="mb-16 flex items-center gap-3"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-white/20 uppercase">
          02
        </span>
        <span className="h-px w-12 bg-white/10" />
        <span className="font-mono text-xs tracking-[0.2em] text-white/30 uppercase">
          Experience
        </span>
      </motion.div>

      <motion.div style={{ opacity }} className="mx-auto max-w-4xl">
        <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-16">
          <span className="text-gradient-silver">From Intern</span>
          <br />
          <span className="text-white/80">to Product Engineer</span>
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-white/[0.06]" />

          {experiences.map((exp, index) => (
            <div
              key={exp.company}
              className={`relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 pb-16 last:pb-0 ${
                index % 2 === 0 ? "" : "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Timeline Node */}
              <div className="absolute left-4 md:left-1/2 top-0 -translate-x-1/2 z-10">
                <motion.div
                  className="w-3 h-3 rounded-full border border-white/20 bg-[#0a0a0a]"
                  animate={{
                    borderColor:
                      activeIndex === index
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(255,255,255,0.12)",
                    scale: activeIndex === index ? 1.2 : 1,
                    boxShadow:
                      activeIndex === index
                        ? "0 0 16px rgba(255,255,255,0.15)"
                        : "0 0 0px rgba(255,255,255,0)",
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/20"
                    animate={{
                      scale: activeIndex === index ? [1, 1.6, 1] : 1,
                      opacity: activeIndex === index ? [0.4, 0, 0.4] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: activeIndex === index ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>

              {/* Content - alternating sides */}
              <div
                className={`ml-10 md:ml-0 ${
                  index % 2 === 0 ? "md:text-right md:pr-14" : "md:pl-14"
                }`}
              >
                <motion.div
                  animate={{
                    x: activeIndex === index ? (index % 2 === 0 ? -6 : 6) : 0,
                    opacity: activeIndex === null || activeIndex === index ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
                    {exp.period}
                  </span>
                  <h3 className="font-heading text-xl font-semibold text-white/70 mt-1">
                    {exp.role}
                  </h3>
                  <p className="text-sm text-white/40 mt-0.5">{exp.company}</p>
                </motion.div>
              </div>

              {/* Achievements */}
              <div
                className={`ml-10 md:ml-0 ${
                  index % 2 === 0 ? "md:pl-14" : "md:text-right md:pr-14"
                }`}
              >
                <motion.ul
                  className="space-y-2"
                  animate={{
                    opacity: activeIndex === null || activeIndex === index ? 1 : 0.2,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {exp.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="text-sm text-white/25 leading-relaxed flex gap-2"
                    >
                      <span className="text-white/10 mt-1.5 flex-shrink-0">—</span>
                      {achievement}
                    </li>
                  ))}
                </motion.ul>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

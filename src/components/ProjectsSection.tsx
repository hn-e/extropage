"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  color: string;
}

const projects: Project[] = [
  {
    title: "Extroverts",
    description:
      "Android & iOS app to party, meet, and hangout with like-minded people in your city. 100+ five-star ratings with 8,000+ users across India.",
    tags: ["React Native", "iOS", "Android", "App Store"],
    link: "#",
    color: "from-white/5 to-white/[0.02]",
  },
  {
    title: "Kitinit.com",
    description:
      "Zero-config full-stack project generator creating production-ready boilerplates for multiple frameworks. Trusted by 27,000+ developers worldwide.",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Open Source"],
    link: "#",
    color: "from-white/[0.02] to-white/5",
  },
  {
    title: "Collabiora",
    description:
      "HIPAA-compliant health research app reimagining how medical findings are communicated. Mayo Clinic backed. Available on Play Store & App Store.",
    tags: ["React Native", "HIPAA", "Health Tech", "Mobile"],
    link: "#",
    color: "from-white/5 to-white/0",
  },
  {
    title: "Face Detection Proctoring",
    description:
      "AI-powered face detection for remote assessment integrity. Captures multi-face scenarios to ensure testing honesty — 7,000+ assessments/month.",
    tags: ["JavaScript", "AI", "Computer Vision", "EdTech"],
    link: "#",
    color: "from-white/0 to-white/5",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      setTilt({
        x: ((y - centerY) / centerY) * 8,
        y: ((x - centerX) / centerX) * -8,
      });
      setGlow({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });
    },
    []
  );

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlow({ x: 50, y: 50 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="flex-shrink-0 w-[380px] sm:w-[420px] px-3"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <div
        className="relative group cursor-pointer perspective-[1200px]"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="glass-border glass-panel rounded-2xl p-8 h-[340px] flex flex-col justify-between overflow-hidden"
          animate={{
            rotateX: tilt.x,
            rotateY: tilt.y,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
            }}
          />

          <div className="relative z-10 space-y-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-heading text-xl font-semibold text-white/80 group-hover:text-white transition-colors duration-500">
              {project.title}
            </h3>
            <p className="text-sm text-white/30 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10px] tracking-[0.05em] text-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            <AnimatePresence>
              {isHovered && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white/80 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  View Project
                  <svg
                    className="w-3 h-3"
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
                </motion.a>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 1, 1]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -420, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 420, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Section Label */}
      <motion.div
        style={{ opacity }}
        className="mb-16 flex items-center gap-3"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-white/20 uppercase">
          03
        </span>
        <span className="h-px w-12 bg-white/10" />
        <span className="font-mono text-xs tracking-[0.2em] text-white/30 uppercase">
          Projects
        </span>
      </motion.div>

      <motion.div style={{ opacity }} className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold">
            <span className="text-gradient-silver">Selected</span>
            <br />
            <span className="text-white/80">Work</span>
          </h2>

          {/* Navigation arrows */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/20 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/20 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-none pb-4 -mx-3 snap-x snap-mandatory"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {projects.map((project, index) => (
            <div key={project.title} className="snap-start">
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

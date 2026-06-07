"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function ContactSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.2;
      const s = hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.08);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <icosahedronGeometry args={[0.6, 4]} />
        <meshPhysicalMaterial
          color="#f5f5f5"
          metalness={0.1}
          roughness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          wireframe={false}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.64, 3]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
    </Float>
  );
}

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
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const springX = useSpring(position.x, { stiffness: 150, damping: 15 });
  const springY = useSpring(position.y, { stiffness: 150, damping: 15 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.4, y: y * 0.4 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 p-3 group"
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      <span className="text-white/20 group-hover:text-white/60 transition-colors duration-300">
        {icon}
      </span>
      <span className="text-[10px] tracking-[0.15em] text-white/20 group-hover:text-white/40 uppercase transition-colors duration-300">
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
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Section Label */}
      <motion.div
        style={{ opacity }}
        className="mb-16 flex items-center gap-3"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-white/20 uppercase">
          04
        </span>
        <span className="h-px w-12 bg-white/10" />
        <span className="font-mono text-xs tracking-[0.2em] text-white/30 uppercase">
          Connect
        </span>
      </motion.div>

      <motion.div style={{ opacity }} className="mx-auto max-w-4xl text-center">
        {/* 3D Sphere */}
        <div className="relative w-32 h-32 mx-auto mb-12 pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 3], fov: 40 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[3, 2, 3]} intensity={1.5} color="#ffffff" />
            <ContactSphere />
          </Canvas>
        </div>

        <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
          <span className="text-gradient-silver">Let&apos;s Build</span>
          <br />
          <span className="text-white/80">Something Great</span>
        </h2>

        <p className="text-sm sm:text-base text-white/25 max-w-md mx-auto leading-relaxed mb-12">
          I&apos;m always open to discussing new projects, collaborations,
          or opportunities in full-stack and mobile development. Let&apos;s build
          something that reaches real users.
        </p>

        {/* CTA */}
        <a
          href="mailto:himanshoni@gmail.com"
          className="inline-flex items-center gap-3 group px-8 py-3 rounded-full glass-border glass-panel hover:bg-white/[0.05] transition-all duration-500 mb-16"
        >
          <span className="text-sm font-medium tracking-[0.05em] text-white/70 group-hover:text-white transition-colors">
            himanshoni@gmail.com
          </span>
          <svg
            className="w-3 h-3 text-white/30 group-hover:text-white/70 transition-colors group-hover:translate-x-1 transition-transform"
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

        {/* Achievements */}
        <div className="mb-16">
          <h3 className="font-mono text-xs tracking-[0.2em] text-white/20 uppercase mb-6">
            Highlights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
            {[
              "Featured in IITM Topper's Interaction (YouTube & LinkedIn)",
              "Ranked Top 100 in E-Commerce Shoppers' Behaviour Understanding",
              "Special Mention — GitHubify Portfolio Contest, IIT Madras",
              "Leetcode Top 17% (2023)",
            ].map((item) => (
              <div
                key={item}
                className="glass-panel rounded-xl px-4 py-3 text-xs text-white/25 leading-relaxed flex gap-2"
              >
                <span className="text-white/10 mt-0.5 flex-shrink-0">✦</span>
                {item}
              </div>
            ))}
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
              &copy; {new Date().getFullYear()} honey.is-a.dev
            </p>

            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <p className="text-[10px] tracking-[0.2em] text-white/15 uppercase">
                Built with purpose
              </p>
              <span className="w-1 h-1 rounded-full bg-white/10" />
            </div>

            <p className="text-[10px] tracking-[0.2em] text-white/15 uppercase">
              Himanshu Soni
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { useRef, useEffect, Suspense, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { RoundedBox, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";

/* ──────────── Textured Screen ──────────── */

function ScreenDisplay() {
  const texture = useLoader(TextureLoader, "/assets/1.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return (
    <group>
      {/* Screen with app screenshot */}
      <mesh position={[0, 0, 0.062]}>
        <planeGeometry args={[1.25, 2.7]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Glass reflection layer */}
      <mesh position={[0, 0, 0.064]}>
        <planeGeometry args={[1.25, 2.7]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={1}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle reflection stripe */}
      <mesh position={[0, 0.5, 0.065]}>
        <planeGeometry args={[1, 0.6]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ──────────── 3D Phone Model ──────────── */

function PhoneModel() {
  const phoneRef = useRef<THREE.Group>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set(-(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useFrame(({ clock }) => {
    if (phoneRef.current) {
      phoneRef.current.rotation.y =
        springX.get() * 0.25 + Math.sin(clock.elapsedTime * 0.2) * 0.08;
      phoneRef.current.rotation.x =
        springY.get() * 0.2 + Math.cos(clock.elapsedTime * 0.15) * 0.05;
    }
  });

  return (
    <group ref={phoneRef}>
      <Float speed={1.8} rotationIntensity={0.08} floatIntensity={0.25}>
        <group>
          {/* Phone body */}
          <RoundedBox
            args={[1.6, 3.2, 0.12]}
            radius={0.2}
            smoothness={4}
          >
            <meshPhysicalMaterial
              color="#262626"
              metalness={0.85}
              roughness={0.18}
              clearcoat={1}
              clearcoatRoughness={0.05}
              reflectivity={1}
              envMapIntensity={0.4}
            />
          </RoundedBox>

          {/* Metallic frame edge */}
          <RoundedBox
            args={[1.64, 3.24, 0.04]}
            radius={0.22}
            smoothness={4}
          >
            <meshPhysicalMaterial
              color="#c8c8c8"
              metalness={0.95}
              roughness={0.08}
              clearcoat={0.5}
              clearcoatRoughness={0.1}
              reflectivity={1}
              envMapIntensity={0.6}
            />
          </RoundedBox>

          {/* Screen background */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[1.35, 2.85]} />
            <meshBasicMaterial
              color="#000000"
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Real screenshot texture */}
          <Suspense fallback={null}>
            <ScreenDisplay />
          </Suspense>

          {/* Camera notch / dynamic island */}
          <RoundedBox
            args={[0.35, 0.06, 0.01]}
            radius={0.03}
            smoothness={2}
            position={[0, 1.45, 0.07]}
          >
            <meshPhysicalMaterial
              color="#181818"
              metalness={0.15}
              roughness={0.3}
              envMapIntensity={0.1}
            />
          </RoundedBox>
        </group>
      </Float>
    </group>
  );
}

/* ──────────── 3D Scene ──────────── */

function PhoneScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 5]} intensity={3} color="#ffffff" />
      <pointLight position={[-3, -1, -3]} intensity={1.2} color="#a1a1aa" />
      <pointLight position={[0, 2, -4]} intensity={0.8} color="#f5f5f5" />
      <pointLight position={[0, -3, 2]} intensity={0.5} color="#52525b" />
      <PhoneModel />
      <Environment preset="studio" environmentIntensity={0.4} />
    </>
  );
}

/* ──────────── Screenshot Gallery Card ──────────── */

function ScreenshotCard({
  src,
  index,
}: {
  src: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowXY, setGlowXY] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cX = rect.width / 2;
    const cY = rect.height / 2;
    setTilt({ x: ((y - cY) / cY) * 6, y: ((x - cX) / cX) * -6 });
    setGlowXY({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlowXY({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="flex-shrink-0 w-[260px] sm:w-[300px] px-3"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="glass-border-neon glass-panel-pro rounded-2xl p-3 overflow-hidden cursor-pointer perspective-[1200px]"
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glow follow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowXY.x}% ${glowXY.y}%, rgba(255,255,255,0.06) 0%, transparent 55%)`,
          }}
        />

        {/* Metallic bezel frame */}
        <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#0a0a0a]">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-black rounded-b-lg z-10" />
          {/* Screenshot */}
          <img
            src={src}
            alt={`Extroverts screenshot ${index + 1}`}
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>

        {/* Label */}
        <div className="mt-3 flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/20 uppercase">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────── App Info ──────────── */

const features = [
  "Meet new people around you",
  "Hangout at party places",
  "See spotlights in your city",
  "All for free",
];

const storeLinks = {
  appStore:
    "https://apps.apple.com/us/app/extroverts-party-hangout-vibe/id6746046462",
  playStore:
    "https://play.google.com/store/apps/details?id=com.pro.nubpack",
};

const screenshotPaths = [
  "/assets/1.png",
  "/assets/2.png",
  "/assets/3.png",
  "/assets/4.png",
  "/assets/5.png",
  "/assets/6.png",
  "/assets/7.png",
];

/* ──────────── Main Section ──────────── */

export function ExtrovertsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [0, 1, 1]);
  const contentX = useTransform(scrollYProgress, [0.1, 0.4], [80, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.3], [0.85, 1]);

  const scrollGallery = (dir: "left" | "right") => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({
        left: dir === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={containerRef}
      id="extroverts"
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-glow-radial" />
      </div>

      {/* Section Label */}
      <motion.div
        style={{ opacity: sectionOpacity }}
        className="mb-16 flex items-center gap-3"
      >
        <span className="font-mono text-xs tracking-[0.3em] text-white/20 uppercase">
          Featured
        </span>
        <span className="h-px w-12 bg-gradient-to-r from-white/15 to-transparent" />
        <span className="font-mono text-xs tracking-[0.2em] text-white/30 uppercase">
          Product
        </span>
      </motion.div>

      {/* ── Main Two-Column Layout ── */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[600px]">
        {/* Left: 3D Phone */}
        <motion.div
          style={{ opacity: sectionOpacity, scale: phoneScale }}
          className="relative h-[550px] sm:h-[650px] lg:h-[700px] order-2 lg:order-1"
        >
          <Canvas
            camera={{ position: [0, 0, 6], fov: 38, near: 0.1, far: 50 }}
            dpr={[1, 2]}
            performance={{ min: 0.5 }}
            gl={{
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.3,
            }}
          >
            <Suspense fallback={null}>
              <PhoneScene />
            </Suspense>
          </Canvas>

          {/* Glow under the phone */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[300px] h-4 bg-white/[0.02] blur-3xl rounded-full pointer-events-none" />
        </motion.div>

        {/* Right: Content */}
        <motion.div
          style={{ x: contentX, opacity: contentOpacity }}
          className="space-y-10 order-1 lg:order-2"
        >
          {/* App Name + Icon */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/[0.08] flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <span className="font-heading text-xl font-bold text-white/60">
                  E
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-4xl sm:text-5xl font-bold">
                    <span className="text-gradient-metallic">Extroverts</span>
                  </h2>
                  <span className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-0.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white/70" />
                    </span>
                    <span className="text-[9px] tracking-[0.15em] text-white/40 uppercase font-mono">
                      Live
                    </span>
                  </span>
                </div>
                <p className="text-sm text-white/30 mt-1">
                  Party · Hangout · Vibe
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-base text-white/35 leading-relaxed max-w-md">
            A cross-platform mobile app built from scratch — iOS and Android.
            Meet people, discover party spots, and explore what&apos;s
            happening in your city.
          </p>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature}
                className="flex items-center gap-3 glass-border glass-panel-pro rounded-xl px-5 py-3.5 hoverable hover:bg-white/[0.04] transition-all duration-300"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                <span className="text-sm text-white/45">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="glass-border glass-panel-pro rounded-2xl px-6 py-4 hoverable hover:bg-white/[0.04] transition-all duration-300">
              <div className="flex items-center gap-1.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-3.5 h-3.5 text-white/50"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="font-mono text-xl font-semibold text-white/70">
                5.0
              </span>
              <span className="text-[10px] tracking-[0.1em] text-white/25 ml-1">
                · 100+ ratings
              </span>
            </div>

            <div className="glass-border glass-panel-pro rounded-2xl px-6 py-4 hoverable hover:bg-white/[0.04] transition-all duration-300">
              <span className="font-mono text-xl font-semibold text-white/70">
                8K+
              </span>
              <span className="text-[10px] tracking-[0.1em] text-white/25 ml-1">
                downloads
              </span>
            </div>
          </div>

          {/* Store Badges */}
          <div className="flex items-center gap-4 pt-4">
            <a
              href={storeLinks.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-border-neon glass-panel-pro rounded-xl px-5 py-3 flex items-center gap-3 hoverable hover:bg-white/[0.06] transition-all duration-500 group hover:glow-neon"
            >
              <svg className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <span className="block text-[9px] tracking-[0.1em] text-white/30 uppercase leading-tight">
                  Download on the
                </span>
                <span className="block text-sm font-semibold text-white/60 group-hover:text-white/80 transition-colors leading-tight">
                  App Store
                </span>
              </div>
            </a>

            <a
              href={storeLinks.playStore}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-border-neon glass-panel-pro rounded-xl px-5 py-3 flex items-center gap-3 hoverable hover:bg-white/[0.06] transition-all duration-500 group hover:glow-neon"
            >
              <svg className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.993l-2.302 2.302L5.864 2.658z" />
              </svg>
              <div className="text-left">
                <span className="block text-[9px] tracking-[0.1em] text-white/30 uppercase leading-tight">
                  Get it on
                </span>
                <span className="block text-sm font-semibold text-white/60 group-hover:text-white/80 transition-colors leading-tight">
                  Google Play
                </span>
              </div>
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── Screenshot Gallery ── */}
      <motion.div
        style={{ opacity: sectionOpacity }}
        className="mt-24 mx-auto max-w-7xl"
      >
        <div className="flex items-end justify-between mb-10">
          <div>
            <h3 className="font-heading text-2xl font-bold text-white/50">
              App Screenshots
            </h3>
            <p className="text-xs text-white/20 mt-1">
              Real screens from the live app
            </p>
          </div>

          {/* Gallery nav arrows */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scrollGallery("left")}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/25 hover:text-white/50 hover:border-white/18 hover:bg-white/[0.03] transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
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
              onClick={() => scrollGallery("right")}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/25 hover:text-white/50 hover:border-white/18 hover:bg-white/[0.03] transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
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

        {/* Horizontal scroll gallery */}
        <div
          ref={galleryRef}
          className="flex overflow-x-auto scrollbar-none pb-4 -mx-3 snap-x snap-mandatory"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {screenshotPaths.map((src, index) => (
            <div key={src} className="snap-start">
              <div className="group">
                <ScreenshotCard src={src} index={index} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

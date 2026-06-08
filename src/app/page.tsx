"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ExtrovertsSection } from "@/components/ExtrovertsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ConnectSection } from "@/components/ConnectSection";
import { PhoneShowcase } from "@/components/PhoneShowcase";
import { KitintSection } from "@/components/KitintSection";
import { BackgroundCanvas } from "@/components/HeroCanvas";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // phoneProgress: 0 = sphere, 1 = phone (first 10% of scroll)
  const phoneProgress = useTransform(scrollYProgress, [0, 0.10], [0, 1]);
  // terminalProgress: 0 = phone, 1 = terminal (Kitint section, right after PhoneShowcase)
  const terminalProgress = useTransform(scrollYProgress, [0.22, 0.30], [0, 1]);

  return (
    <>
      <BackgroundCanvas phoneProgress={phoneProgress} terminalProgress={terminalProgress} />
      <main ref={containerRef} className="relative">
        <Navbar />
        <HeroSection />
        <PhoneShowcase />
        <KitintSection />
        <AboutSection />
        {/* <ExperienceSection /> */}
        {/* <ExtrovertsSection /> */}
        {/* <ProjectsSection /> */}
        <ConnectSection />
      </main>
    </>
  );
}

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
import { BackgroundCanvas } from "@/components/HeroCanvas";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // morphProgress: 0 = sphere, 1 = phone (starts immediately on scroll)
  const morphProgress = useTransform(scrollYProgress, [0, 0.10], [0, 1]);

  return (
    <>
      <BackgroundCanvas morphProgress={morphProgress} />
      <main ref={containerRef} className="relative">
        <Navbar />
        <HeroSection />
        <PhoneShowcase />
        <AboutSection />
        <ExperienceSection />
        <ExtrovertsSection />
        <ProjectsSection />
        <ConnectSection />
      </main>
    </>
  );
}

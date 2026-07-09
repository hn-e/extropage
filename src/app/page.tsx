"use client";

import { useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ConnectSection } from "@/components/ConnectSection";
import { KitintSection } from "@/components/KitintSection";
import { BackgroundCanvas } from "@/components/HeroCanvas";
import { HorizontalScroll } from "@/components/HorizontalScroll";
import { MarqueeSection } from "@/components/MarqueeSection";
import { ExtrovertsSection } from "@/components/ExtrovertsSection";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <BackgroundCanvas />
      <main ref={containerRef} className="relative">
        <Navbar />
        <HeroSection />
        <div className="h-screen" />
        <HorizontalScroll />
        <MarqueeSection />
        <ExtrovertsSection />
        <KitintSection />
        <ConnectSection />
      </main>
    </>
  );
}

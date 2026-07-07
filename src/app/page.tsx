"use client";

import { useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ConnectSection } from "@/components/ConnectSection";
import { PhoneShowcase } from "@/components/PhoneShowcase";
import { KitintSection } from "@/components/KitintSection";
import { BackgroundCanvas } from "@/components/HeroCanvas";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <BackgroundCanvas />
      <main ref={containerRef} className="relative">
        <Navbar />
        <HeroSection />
        <PhoneShowcase />
        <KitintSection />
        <AboutSection />
        <ConnectSection />

        {/* Full-width image */}
        <section className="w-full relative">
          <Image
            src="/himanshu_soni.png"
            alt="Himanshu Soni"
            width={1200}
            height={800}
            className="w-full h-auto block"
            priority
          />
        </section>
      </main>
    </>
  );
}

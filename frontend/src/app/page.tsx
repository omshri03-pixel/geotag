"use client";

import React, { useState, useEffect } from "react";

// Component Imports
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Dataflow } from "@/components/landing/Dataflow";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pipeline } from "@/components/landing/Pipeline";
import { Sandbox } from "@/components/landing/Sandbox";
import { Deployments } from "@/components/landing/Deployments";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  const [demoFormat, setDemoFormat] = useState<"webp" | "avif" | "original">("webp");
  const [demoScatter, setDemoScatter] = useState(25);
  const [demoScraped, setDemoScraped] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [isScraping, setIsScraping] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Interactive Pin Scatter coordinates (Manhattan Center)
  const baseLat = 40.7128;
  const baseLng = -74.0060;
  
  // Custom mock scattered pins on map based on scatter radius
  const getMockPins = (radius: number) => {
    return [
      { id: 1, lat: baseLat + (radius * 0.00014), lng: baseLng + (radius * 0.00011), label: "dental_office_1.webp" },
      { id: 2, lat: baseLat - (radius * 0.00016), lng: baseLng - (radius * 0.00013), label: "lobby_reception.webp" },
      { id: 3, lat: baseLat + (radius * 0.00008), lng: baseLng - (radius * 0.00019), label: "surgery_room.webp" },
    ];
  };

  const currentPins = getMockPins(demoScatter);

  // Console logging simulation
  const addLog = (msg: string) => {
    setConsoleLogs((prev) => [...prev, msg]);
  };

  const handleStartScrape = () => {
    if (isScraping) return;
    setIsScraping(true);
    setDemoScraped(false);
    setScrapeProgress(0);
    setConsoleLogs([]);
    
    const logs = [
      "[MAP-INIT] Routing Mapbox geocoding grid protocols... CONNECTED",
      "[SCRAPER] Target Scrape URL loaded: https://www.rohandental.com/gallery",
      "[SCRAPER] Crawling gallery attachments... Found 3 Raw JPEGs",
      "[METADATA] Initializing ExifTool coordinate writer...",
      `[PRESET-LOAD] Location loaded: 'Manhattan Dental Partners, NYC'`,
      `[COORDINATES] Latitude: ${baseLat}° N | Longitude: ${baseLng}° W`,
      `[GPS-SCATTER] Applying Anti-Footprint scatter radius: ±${demoScatter} meters`,
      `[COMPRESS] Compressing raw assets to Next-Gen: ${demoFormat.toUpperCase()} (-91.2%)`,
      `[EXIF-WRITE] Injected GPSLatitudeRef, GPSLongitudeRef, GPSAltitude, GPSDateStamp`,
      `[SEO-WRITE] Injected Alt Keywords: 'Best Dentist in NYC', 'Dental Clinic Manhattan'`,
      `[VERIFY] ExifTool check: OK. GPS Coordinate headers successfully verified.`,
      "[SYSTEM] 3 Map-Pack optimized images staged in workspace queue."
    ];

    let currentLogIndex = 0;
    const intervalTime = 220;
    
    const logInterval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        addLog(logs[currentLogIndex]);
        setScrapeProgress(Math.min(((currentLogIndex + 1) / logs.length) * 100, 100));
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
        setIsScraping(false);
        setDemoScraped(true);
      }
    }, intervalTime);
  };

  // Workflow auto-stepping
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#171717] text-[#F3F4F6] overflow-x-hidden relative flex flex-col font-sans selection:bg-[#F25623]/20 selection:text-[#DEDEDE] w-full">
      
      {/* ==================== COORDINATE GRID & TOPOGRAPHIC BACKGROUND ==================== */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F0F1E_1px,transparent_1px),linear-gradient(to_bottom,#0F0F1E_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none z-0" />
      
      {/* Technical Grid Labels */}
      <div className="absolute top-[8%] left-8 text-[9px] text-[#DEDEDE] font-mono pointer-events-none select-none tracking-widest hidden xl:block">
        <span>GRID LAT: 40.7128° N | LNG: -74.0060° W</span>
      </div>
      <div className="absolute top-[12%] right-8 text-[9px] text-[#DEDEDE] font-mono pointer-events-none select-none tracking-widest hidden xl:block">
        <span>COMPASS DIAL: COMPATIBLE</span>
      </div>

      {/* Ambient Map Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,rgba(255,102,0,0.1)_0%,transparent_60%)] pointer-events-none z-0" />
      <div className="absolute top-[1200px] right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.03)_0%,transparent_70%)] pointer-events-none z-0" />
      <div className="absolute bottom-[600px] left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(255,102,0,0.03)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Landing Sections */}
      <Navbar />
      
      <main>
        <Hero />
        <Dataflow />
        <LogoMarquee />
        <Features />
        <HowItWorks />
        <Pipeline activeWorkflowStep={activeWorkflowStep} />
        
        <Sandbox 
          handleStartScrape={handleStartScrape}
          isScraping={isScraping}
          demoFormat={demoFormat}
          setDemoFormat={setDemoFormat}
          demoScatter={demoScatter}
          setDemoScatter={setDemoScatter}
          consoleLogs={consoleLogs}
          scrapeProgress={scrapeProgress}
          currentPins={currentPins}
          baseLat={baseLat}
          baseLng={baseLng}
          addLog={addLog}
        />
        
        <Deployments />
        <Pricing />
        <Testimonials />
        
        <FAQ 
          activeFaq={activeFaq} 
          setActiveFaq={setActiveFaq} 
        />
        
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-[#F25623]/30 bg-[#171717] w-full rounded-t-[40px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,102,0,0.03)_0%,transparent_60%)] pointer-events-none" />
          <CTA />
          <Footer />
        </section>
      </main>
    </div>
  );
}

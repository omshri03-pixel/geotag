"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, ArrowLeft, ShieldAlert, BookOpen, Globe, Scale } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: <BookOpen className="w-5 h-5 text-brand" />,
      title: "1. Acceptance of Terms",
      desc: "By launching or subscribing to the LocalLens AI EXIF geocoding pipeline workspace suite, you explicitly consent to and agree to remain fully compliant with these corporate terms and conditions of usage.",
    },
    {
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      title: "2. Geocoding & GPS Limitations",
      desc: "Our systems extract and inject coordinates matrices dynamically utilizing live public Mapbox API hooks. Users are strictly responsible for confirming the accuracy of physical street addresses and latitude/longitude presets maps coordinates.",
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-brand" />,
      title: "3. Website Scraper Acceptable Use",
      desc: "The gallery URL scraper module is designed solely to crawl local storefront practice assets bulk with full consent of the target web portal owners. Crawling protected, copyrighted, or unauthorized private portals is strictly prohibited.",
    },
    {
      icon: <Scale className="w-5 h-5 text-cyan-400" />,
      title: "4. Algorithmic Ranks Liability",
      desc: "While geotagged metadata represents a proven SEO variable, LocalLens AI assumes zero liability for ultimate search listing results, index penalties, search engine fluctuations, or account listing suspension actions by Google or related pack engines.",
    }
  ];

  return (
    <div className="min-h-screen bg-bg text-text-main relative overflow-hidden flex flex-col justify-between font-sans selection:bg-brand selection:text-black">
      
      {/* Topographic Background & Spotlight */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F0F1E_1px,transparent_1px),linear-gradient(to_bottom,#0F0F1E_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[radial-gradient(circle_at_top,rgba(0,229,255,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[94%] max-w-6xl z-[60] rounded-full border border-white/[0.08] bg-[#05050A]/85 backdrop-blur-xl px-4 sm:px-6 py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.7)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-[#FF8533] flex items-center justify-center shadow-lg shadow-brand/20 transition-transform group-hover:rotate-45 duration-300 shrink-0">
            <Navigation className="text-black w-4.5 h-4.5 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white leading-none">LocalLens AI</span>
            <span className="text-[7.5px] text-cyan-400 font-mono tracking-widest mt-1 uppercase font-black">EXIF GPS Core v2.2</span>
          </div>
        </Link>
        
        <Link 
          href="/" 
          className="text-[11px] font-extrabold text-zinc-400 hover:text-white transition-colors tracking-wide flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </header>

      {/* Main Section */}
      <main className="relative z-10 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full flex-grow">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12 text-left"
        >
          {/* Header */}
          <div className="space-y-4">
            <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest font-black bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1.5 rounded-full inline-block">
              Corporate Standards
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-sans">
              Terms & Services
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Last updated: May 19, 2026. Please review our compliance standards, API rate limit rules, and database security conditions carefully.
            </p>
          </div>

          {/* Sections list */}
          <div className="space-y-6 pt-4">
            {sections.map((sec, index) => (
              <div 
                key={index}
                className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-brand/35 transition-colors duration-300"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {sec.icon}
                  </div>
                  <h3 className="text-base font-extrabold text-white">
                    {sec.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium pl-0 sm:pl-12">
                  {sec.desc}
                </p>
              </div>
            ))}
          </div>

        </motion.div>

      </main>

      {/* Reusable Subfooter */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-400 font-medium font-sans">
        <span>&copy; {new Date().getFullYear()} LocalLens AI. All rights reserved.</span>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="/dashboard" className="hover:text-white transition-colors">Workspace</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white transition-colors">Terms & Services</Link>
        </div>
      </footer>

    </div>
  );
}

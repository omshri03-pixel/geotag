"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, ArrowLeft, TrendingUp, Zap, Image, CheckCircle, ArrowRight } from "lucide-react";

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-bg text-text-main relative overflow-hidden flex flex-col justify-between font-sans selection:bg-brand selection:text-black">
      
      {/* Topographic Background & Spotlight */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F0F1E_1px,transparent_1px),linear-gradient(to_bottom,#0F0F1E_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[94%] max-w-6xl z-[60] rounded-full border border-white/[0.08] bg-[#05050A]/85 backdrop-blur-xl px-4 sm:px-6 py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.7)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-[#06B6D4] flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-transform group-hover:rotate-45 duration-300 shrink-0">
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
      <main className="relative z-10 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex-grow">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12 text-left"
        >
          {/* Header */}
          <div className="space-y-4">
            <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest font-black bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1.5 rounded-full inline-block">
              Proven Results
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-sans">
              Geotagging Case Studies
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Read how leading digital marketing agencies, local practices, and medical facilities leveraged LocalLens AI to scale coordinate metadata dispersal safely.
            </p>
          </div>

          {/* Case Studies Stack */}
          <div className="space-y-8 pt-4">
            
            {/* Case Study 1 */}
            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 sm:p-8 relative overflow-hidden group hover:border-cyan-400/40 transition-colors duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.03),transparent_70%)] pointer-events-none" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white/[0.04]">
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase font-black tracking-widest">Medical & Dental SEO</span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">Rohan Dental Clinic - Manhattan</h3>
                </div>
                <span className="text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-black font-mono">#22 to #1 Rank</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <span className="block text-[9px] font-black text-white uppercase tracking-wider font-mono">The Scenario</span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    The client had standard dental practice photos without embedded geocodes. They were losing local pack visibility to competitors situated closer to Midtown Central.
                  </p>
                  <span className="block text-[9px] font-black text-white uppercase tracking-wider font-mono pt-3">Our Implementation</span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Scraped all website galleries bulk, compressed payload size to WebP, and batch-injected NY Manhattan coordinate presets using our compiler.
                  </p>
                </div>
                <div className="bg-[#08080E] border border-white/[0.04] p-4 rounded-xl space-y-3 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <span className="font-extrabold text-sm">Ranks Secured</span>
                  </div>
                  <ul className="text-[11px] text-zinc-300 space-y-1 font-medium">
                    <li className="flex items-center gap-1.5">✓ 90%+ Payload Saved</li>
                    <li className="flex items-center gap-1.5">✓ Zero algorithmic flags</li>
                    <li className="flex items-center gap-1.5">✓ +320% customer reviews</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 sm:p-8 relative overflow-hidden group hover:border-cyan-400/40 transition-colors duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.03),transparent_70%)] pointer-events-none" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white/[0.04]">
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase font-black tracking-widest">Legal Firm Growth</span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">Oak & Iron Lawyers - Chicago</h3>
                </div>
                <span className="text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-black font-mono">100% Anti-Footprint</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <span className="block text-[9px] font-black text-white uppercase tracking-wider font-mono">The Scenario</span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    A prominent Chicago legal firm had duplicate listing issues. They wanted to optimize image EXIF metadata on their profiles without alerting algorithmic search spam flags.
                  </p>
                  <span className="block text-[9px] font-black text-white uppercase tracking-wider font-mono pt-3">Our Implementation</span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Applied our 25-meter Anti-Footprint GPS Dispersal module to scatter pin drops randomly around client Chicago offices to create a safe, fully organic distribution.
                  </p>
                </div>
                <div className="bg-[#08080E] border border-white/[0.04] p-4 rounded-xl space-y-3 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span className="font-extrabold text-sm">Metadata Sync</span>
                  </div>
                  <ul className="text-[11px] text-zinc-300 space-y-1 font-medium">
                    <li className="flex items-center gap-1.5">✓ Scattered GPS coordinates</li>
                    <li className="flex items-center gap-1.5">✓ Safe from algorithms</li>
                    <li className="flex items-center gap-1.5">✓ +145% phone bookings</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Case Study 3 */}
            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 sm:p-8 relative overflow-hidden group hover:border-cyan-400/40 transition-colors duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.03),transparent_70%)] pointer-events-none" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white/[0.04]">
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase font-black tracking-widest">Real Estate Marketing</span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">Pinnacle Real Estate - Houston</h3>
                </div>
                <span className="text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-black font-mono">91% Speed Boost</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <span className="block text-[9px] font-black text-white uppercase tracking-wider font-mono">The Scenario</span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Houston real estate listings loaded slowly due to massive uncompressed photographic files, hurting mobile page-speed index and conversion metrics.
                  </p>
                  <span className="block text-[9px] font-black text-white uppercase tracking-wider font-mono pt-3">Our Implementation</span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Injected exact Houston coordinates, altitude matrices, and direction headings while bulk converting raw JPEGs into high-speed compressed WebP files.
                  </p>
                </div>
                <div className="bg-[#08080E] border border-white/[0.04] p-4 rounded-xl space-y-3 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <Image className="w-5 h-5 text-cyan-400" />
                    <span className="font-extrabold text-sm">Payload Stats</span>
                  </div>
                  <ul className="text-[11px] text-zinc-300 space-y-1 font-medium">
                    <li className="flex items-center gap-1.5">✓ 91.2% File Size Saved</li>
                    <li className="flex items-center gap-1.5">✓ Perfect metadata retention</li>
                    <li className="flex items-center gap-1.5">✓ Faster listing loads</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Call to action panel */}
          <div className="border border-white/[0.08] bg-[#05050A]/95 rounded-[32px] p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.04),transparent_70%)]" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-left">
              <div className="space-y-2">
                <h4 className="text-lg sm:text-xl font-extrabold text-white">Dominate Map Pack Ranks</h4>
                <p className="text-xs text-zinc-400 max-w-md font-medium leading-relaxed">
                  Start optimizing your photo metadata files bulk. Free tier available to run up to 10 geocoded images per day.
                </p>
              </div>
              <Link 
                href="/login" 
                className="bg-gradient-to-r from-cyan-400 to-[#06B6D4] text-black font-black px-6 py-3 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/10 hover:scale-[1.02] active:scale-95 duration-200"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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

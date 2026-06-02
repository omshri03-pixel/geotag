"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, ArrowLeft, Users, Shield, Target, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg text-text-main relative overflow-hidden flex flex-col justify-between font-sans selection:bg-brand selection:text-black">
      
      {/* Topographic Background & Spotlight */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F0F1E_1px,transparent_1px),linear-gradient(to_bottom,#0F0F1E_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[radial-gradient(circle_at_top,rgba(222,222,222,0.06)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[94%] max-w-6xl z-[60] rounded-full border border-white/[0.08] bg-[#05050A]/85 backdrop-blur-xl px-4 sm:px-6 py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.7)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-400 to-[#DEDEDE] flex items-center justify-center shadow-lg shadow-zinc-500/20 transition-transform group-hover:rotate-45 duration-300 shrink-0">
            <Navigation className="text-black w-4.5 h-4.5 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white leading-none">LocalLens AI</span>
            <span className="text-[7.5px] text-zinc-400 font-mono tracking-widest mt-1 uppercase font-black">EXIF GPS Core v2.2</span>
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
            <span className="text-zinc-300 font-mono text-[10px] uppercase tracking-widest font-black bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full inline-block">
              Corporate Vision
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-sans">
              About Our Geotagging Vision
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              We empower modern search engine marketers, multi-location agencies, and local businesses to optimize camera EXIF coordinates, building bulletproof GMB pack dominance.
            </p>
          </div>

          {/* Grid Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-zinc-400/40 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-zinc-300" />
              </div>
              <h3 className="text-base font-extrabold text-white mb-2">Our Mission</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                To eliminate complex manual coordinate inject pipelines. We make it easy to scrape galleries, optimize file formats bulk, and embed coordinates securely without breaking compression parameters.
              </p>
            </div>

            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-cyan-400/40 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-base font-extrabold text-white mb-2">Metadata Integrity</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Search crawlers heavily analyze EXIF headers. We ensure every compressed asset strictly retains GPS offsets, coordinates matrices, and direction headings to comply with search algorithms.
              </p>
            </div>

            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-cyan-400/40 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-base font-extrabold text-white mb-2">For Modern Agencies</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Designed to support massive bulk multi-client campaigns. Manage over 100+ storefront listing locations dynamically in a central high-speed workspace database.
              </p>
            </div>

            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-zinc-400/40 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Award className="w-5 h-5 text-zinc-300" />
              </div>
              <h3 className="text-base font-extrabold text-white mb-2">Proven Track Record</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Serving over 5,500+ SEO professionals globally. Over 1.5 million pictures geocoded successfully with 100% Mapbox API mapping synchronization.
              </p>
            </div>

          </div>

          {/* Call to action panel */}
          <div className="border border-white/[0.08] bg-[#05050A]/95 rounded-[32px] p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(222,222,222,0.03),transparent_70%)]" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-left">
              <div className="space-y-2">
                <h4 className="text-lg sm:text-xl font-extrabold text-white">Dominate Map Pack Ranks</h4>
                <p className="text-xs text-zinc-400 max-w-md font-medium leading-relaxed">
                  Start optimizing your photo metadata files bulk. Free tier available to run up to 10 geocoded images per day.
                </p>
              </div>
              <Link 
                href="/login" 
                className="bg-gradient-to-r from-zinc-400 to-[#DEDEDE] text-black font-black px-6 py-3 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-zinc-500/10 hover:scale-[1.02] active:scale-95 duration-200"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </motion.div>

      </main>

      {/* Reusable Subfooter */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-400 font-medium">
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

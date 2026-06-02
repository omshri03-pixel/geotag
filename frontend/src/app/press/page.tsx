"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, ArrowLeft, Calendar, FileText, Share2, Mail, ArrowRight } from "lucide-react";

export default function PressRoomPage() {
  const articles = [
    {
      date: "May 15, 2026",
      tag: "Product Release",
      title: "LocalLens AI Launches v2.2 Geocoding Compiler Suite with Anti-Footprint Algorithms",
      desc: "Introducing advanced coordinate dispersion parameters and bulk EXIF data parsing to protect local business listings from algorithm spam flags.",
    },
    {
      date: "April 28, 2026",
      tag: "Technology Integration",
      title: "Active Mapbox API Synchronized to Secure PostgreSQL Database Systems",
      desc: "SEO professionals can now log and persist geo-targeted presets history, allowing instant packet re-downloads and local metadata audits.",
    },
    {
      date: "March 12, 2026",
      tag: "Milestone",
      title: "LocalLens AI Reaches 5.5K Active SEO Agency Connections Globally",
      desc: "More local consultants and search engine optimization bureaus are shifting to lossless WebP compression formats containing embedded coordinates.",
    }
  ];

  return (
    <div className="min-h-screen bg-bg text-text-main relative overflow-hidden flex flex-col justify-between font-sans selection:bg-brand selection:text-black">
      
      {/* Topographic Background & Spotlight */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F0F1E_1px,transparent_1px),linear-gradient(to_bottom,#0F0F1E_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[radial-gradient(circle_at_top,rgba(255,102,0,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[94%] max-w-6xl z-[60] rounded-full border border-white/[0.08] bg-[#05050A]/85 backdrop-blur-xl px-4 sm:px-6 py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.7)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-[#FF8533] flex items-center justify-center shadow-lg shadow-brand/20 transition-transform group-hover:rotate-45 duration-300 shrink-0">
            <Navigation className="text-black w-4.5 h-4.5 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white leading-none">LocalLens AI</span>
            <span className="text-[7.5px] text-brand font-mono tracking-widest mt-1 uppercase font-black">EXIF GPS Core v2.2</span>
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
            <span className="text-brand font-mono text-[10px] uppercase tracking-widest font-black bg-brand/10 border border-brand/20 px-3.5 py-1.5 rounded-full inline-block">
              Press Room
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-sans">
              Corporate Announcements
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Read our official press releases, product updates, integration alerts, and corporate milestones here.
            </p>
          </div>

          {/* Articles list */}
          <div className="space-y-6 pt-4">
            {articles.map((item, index) => (
              <div 
                key={index}
                className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 sm:p-8 relative overflow-hidden group hover:border-brand/40 transition-colors duration-300 flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-3 max-w-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-brand" /> {item.date}
                    </span>
                    <span className="text-[9px] bg-brand/10 border border-brand/20 text-brand px-2 py-0.5 rounded-full font-black uppercase font-mono tracking-widest">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-brand transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
                <div className="flex md:flex-col justify-end items-end gap-3 shrink-0">
                  <button className="text-[10px] bg-white/5 border border-white/10 hover:border-white/20 text-zinc-300 font-extrabold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" /> Read Full PDF
                  </button>
                  <button className="text-[10px] bg-white/5 border border-white/10 hover:border-white/20 text-zinc-300 font-extrabold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-zinc-400" /> Share Press
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Media Contact details */}
          <div className="border border-white/[0.08] bg-[#05050A]/95 rounded-[32px] p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(255,102,0,0.04),transparent_70%)]" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-left">
              <div className="space-y-2">
                <h4 className="text-lg sm:text-xl font-extrabold text-white">Media & Press Contact</h4>
                <p className="text-xs text-zinc-400 max-w-md font-medium leading-relaxed">
                  For press inquiries, brand assets download, logo vectors, or interview bookings, get in touch with our communications bureau.
                </p>
              </div>
              <a 
                href="mailto:press@locallensai.com"
                className="bg-gradient-to-r from-brand to-[#FF8533] text-black font-black px-6 py-3 rounded-full text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-brand/10 hover:scale-[1.02] active:scale-95 duration-200"
              >
                press@locallensai.com <Mail className="w-4 h-4 text-black" />
              </a>
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

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Compass, Map, ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-36 sm:pt-44 md:pt-48 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center z-10 w-full">
      
      {/* Floating Geographic EXIF Badges */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10 w-full">
        <motion.div 
          animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute top-36 left-[3%] xl:left-[6%] bg-[#171717]/95 border border-[#F25623]/40 text-[#DEDEDE] px-3.5 py-2 rounded-xl text-[9.5px] font-mono flex items-center gap-2 shadow-xl z-20 hidden lg:flex"
        >
          <MapPin className="w-3.5 h-3.5 text-[#F25623] shrink-0" />
          <span>Manhattan GPS Sync Preset: OK</span>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-56 right-[3%] xl:right-[6%] bg-[#171717]/95 border border-[#4D4D4D] text-[#DEDEDE] px-3.5 py-2 rounded-xl text-[9.5px] font-mono flex items-center gap-2 shadow-xl z-20 hidden lg:flex"
        >
          <Compass className="w-3.5 h-3.5 text-[#DEDEDE] animate-spin [animation-duration:12s] shrink-0" />
          <span>EXIF Heading: N 12° E</span>
        </motion.div>
      </div>

      {/* Premium Badging (Product Hunt / Launch Style) */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#171717] border border-[#4D4D4D] text-[#DEDEDE] text-[10.5px] sm:text-xs font-black shadow-lg tracking-wider uppercase mb-6"
      >
        <span className="w-2 h-2 rounded-full bg-[#F25623] animate-pulse" />
        <span className="text-[#DEDEDE]">LocalLens v2.2 Launch</span>
        <span className="w-[1px] h-3 bg-zinc-700" />
        <span className="text-[#F25623]">Active GMB Map Pack Sync</span>
      </motion.div>

      {/* Hero Title - Bold, modern, centered */}
      <motion.h1 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-[#DEDEDE] leading-[1.15] max-w-5xl font-sans"
      >
        Pinpoint Your Rankings <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F25623] via-[#ff7c4d] to-[#F25623] relative block sm:inline mt-2 sm:mt-0">
          With Geotagged Maps Metadata
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-[#DEDEDE]/80 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed mt-5 mx-auto font-medium px-2 sm:px-6"
      >
        Inject verified coordinate presets, altitude matrices, and local search variables directly inside client photo EXIF headers. Auto-crawl websites, compress file payloads lossless, and build GMB pack prominence without leaving a trace.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 w-full sm:w-auto z-20 px-4"
      >
        <Link 
          href="/login" 
          className="bg-[#F25623] text-[#171717] font-black px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-[#F25623]/20 hover:shadow-2xl hover:shadow-[#F25623]/35 cursor-pointer w-full sm:w-auto hover:scale-[1.02] active:scale-95 duration-200"
        >
          Launch Map Workspace <Map className="w-4 h-4 text-[#171717]" />
        </Link>
        <a 
          href="#sandbox"
          className="bg-[#171717] hover:bg-[#171717]/80 border border-[#4D4D4D] text-[#DEDEDE] font-extrabold px-8 py-4 rounded-full transition-all text-sm cursor-pointer w-full sm:w-auto hover:scale-[1.02] active:scale-95 duration-200 flex items-center justify-center gap-2"
        >
          Open Interactive Sandbox <Compass className="w-4 h-4 text-[#DEDEDE]" />
        </a>
      </motion.div>
    </section>
  );
};

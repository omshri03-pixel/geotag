"use client";

import React from "react";
import { Globe, Map, Navigation, Compass, Server } from "lucide-react";

export const LogoMarquee = () => {
  return (
    <section className="py-12 border-y border-[#4D4D4D]/30 bg-[#171717]/40 overflow-hidden w-full relative z-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <span className="text-[9px] sm:text-[10px] uppercase font-mono font-black text-[#DEDEDE] tracking-widest block mb-6">
          COMPATIBLE WITH ALL LEADING MAPPING PLATFORMS
        </span>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-14 opacity-60 hover:opacity-90 transition-all duration-300">
          <div className="flex items-center gap-2.5 text-[#DEDEDE] font-black font-sans text-xs sm:text-sm tracking-tight bg-[#171717]/95 px-4 py-2.5 rounded-full border border-[#4D4D4D]/20 shadow-md">
            <Globe className="w-4 h-4 text-[#F25623] shrink-0" /> Google Maps
          </div>
          <div className="flex items-center gap-2.5 text-[#DEDEDE] font-black font-sans text-xs sm:text-sm tracking-tight bg-[#171717]/95 px-4 py-2.5 rounded-full border border-[#4D4D4D]/20 shadow-md">
            <Map className="w-4 h-4 text-[#DEDEDE] shrink-0" /> Mapbox GL
          </div>
          <div className="flex items-center gap-2.5 text-[#DEDEDE] font-black font-sans text-xs sm:text-sm tracking-tight bg-[#171717]/95 px-4 py-2.5 rounded-full border border-[#4D4D4D]/20 shadow-md">
            <Navigation className="w-4 h-4 text-[#DEDEDE] shrink-0" /> Apple Maps
          </div>
          <div className="flex items-center gap-2.5 text-[#DEDEDE] font-black font-sans text-xs sm:text-sm tracking-tight bg-[#171717]/95 px-4 py-2.5 rounded-full border border-[#4D4D4D]/20 shadow-md">
            <Compass className="w-4 h-4 text-[#DEDEDE] shrink-0" /> OpenStreetMap
          </div>
          <div className="flex items-center gap-2.5 text-[#DEDEDE] font-black font-sans text-xs sm:text-sm tracking-tight bg-[#171717]/95 px-4 py-2.5 rounded-full border border-[#4D4D4D]/20 shadow-md">
            <Server className="w-4 h-4 text-[#DEDEDE] shrink-0" /> Google Business Profile
          </div>
        </div>
      </div>
    </section>
  );
};

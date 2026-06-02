"use client";

import React from "react";

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border border-[#F25623]/30 bg-[#171717] rounded-[40px] w-full mb-16 shadow-2xl shadow-[#F25623]/5">
      
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <span className="text-[#F25623] font-mono text-xs uppercase tracking-widest font-black bg-[#F25623]/20 border border-[#F25623]/30 px-3.5 py-1.5 rounded-full inline-block">
          System Protocol
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#DEDEDE] leading-tight font-sans">
          How It Works
        </h2>
        <p className="text-[#DEDEDE] text-sm sm:text-base max-w-xl mx-auto font-medium px-2">
          Streamlining geo-targeted local authority projection in three basic, high-speed procedural steps.
        </p>
      </div>

      {/* 3-Column Visual Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative text-left w-full">
        
        {/* Connector Line for Desktop */}
        <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#F25623]/20 via-cyan-400/20 to-[#F25623]/20 -z-10 animate-pulse" />

        {/* Stage 1 */}
        <div className="border border-[#4D4D4D] bg-[#171717] rounded-[24px] p-6 relative overflow-hidden group hover:border-[#F25623]/30 transition-all duration-300 flex flex-col justify-between gap-6 h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(255,102,0,0.03),transparent_70%)]" />
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-xl bg-[#F25623]/20 border border-[#F25623]/30 flex items-center justify-center font-mono font-black text-[#F25623] text-sm shadow shadow-[#F25623]/10">
              01
            </div>
            <span className="text-[8px] font-mono text-[#DEDEDE] uppercase tracking-widest">Stage A: Gather</span>
          </div>
          <div className="space-y-2 pt-4">
            <h3 className="font-extrabold text-base sm:text-lg text-[#DEDEDE]">Extract & Import</h3>
            <p className="text-xs text-[#DEDEDE] leading-relaxed font-medium">
              Enter your GMB client's domain or upload raw camera JPEGs directly. Our system instantly crawls clinic pages, fetches attachments, and caches assets under full compression security.
            </p>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="border border-[#4D4D4D] bg-[#171717] rounded-[24px] p-6 relative overflow-hidden group hover:border-[#4D4D4D] transition-all duration-300 flex flex-col justify-between gap-6 h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.03),transparent_70%)]" />
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-xl bg-[#4D4D4D] border border-[#4D4D4D] flex items-center justify-center font-mono font-black text-[#DEDEDE] text-sm shadow shadow-cyan-400/15">
              02
            </div>
            <span className="text-[8px] font-mono text-[#DEDEDE] uppercase tracking-widest">Stage B: Map</span>
          </div>
          <div className="space-y-2 pt-4">
            <h3 className="font-extrabold text-base sm:text-lg text-[#DEDEDE]">Geocode & Offset</h3>
            <p className="text-xs text-[#DEDEDE] leading-relaxed font-medium">
              Locate storefront parameters automatically using our integrated Mapbox API. Define your Anti-Footprint dispersed meter radius to safely scatter coordinate pins, avoiding listing spam flags.
            </p>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="border border-[#4D4D4D] bg-[#171717] rounded-[24px] p-6 relative overflow-hidden group hover:border-[#F25623]/30 transition-all duration-300 flex flex-col justify-between gap-6 h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(255,102,0,0.03),transparent_70%)]" />
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-xl bg-[#F25623]/20 border border-[#F25623]/30 flex items-center justify-center font-mono font-black text-[#F25623] text-sm shadow shadow-[#F25623]/10">
              03
            </div>
            <span className="text-[8px] font-mono text-[#DEDEDE] uppercase tracking-widest">Stage C: Stamp</span>
          </div>
          <div className="space-y-2 pt-4">
            <h3 className="font-extrabold text-base sm:text-lg text-[#DEDEDE]">Compile & Publish</h3>
            <p className="text-xs text-[#DEDEDE] leading-relaxed font-medium">
              Run the EXIF metadata compiler. Download the optimized WebP/AVIF bundle with embedded altitude matrices, direction bearings, and geocoded preset stamps, ready to rank in GMB packs.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
};

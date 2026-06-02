"use client";

import React from "react";

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#F25623]">
      <div className="max-w-7xl mx-auto w-full">

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <span className="text-[#171717] font-mono text-xs uppercase tracking-widest font-black bg-white/20 border border-[#171717]/20 px-3.5 py-1.5 rounded-full inline-block shadow-sm">
            Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
            Don't Trust Our Word For It
          </h2>
          <p className="text-[#171717] text-sm sm:text-base max-w-xl mx-auto font-medium px-2">
            Hear from leading search engine optimization teams, clinical agencies, and local multi-store directory administrators.
          </p>
        </div>

        {/* Testimonials Grid (Stacks on mobile/tablet) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full text-left">
          
          {/* Review 1 */}
          <div className="border border-[#171717] bg-[#171717] rounded-[24px] p-6 relative overflow-hidden group transition-all duration-300 flex flex-col justify-between h-full shadow-2xl opacity-90 hover:opacity-100 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#F25623] text-sm">★</span>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#DEDEDE] leading-relaxed font-medium italic">
                "We were losing map visibility to dental clinic competitors situated closer to Central Midtown. After injecting NY Manhattan presets bulk, our local listing map pack views skyrocketed by 320%!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 border-t border-[#4D4D4D] mt-6">
              <div className="w-9 h-9 rounded-full bg-[#4D4D4D] border border-[#4D4D4D] flex items-center justify-center font-bold text-white text-xs font-mono">
                RG
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Dr. Rohan G.</h4>
                <span className="text-[9px] text-[#DEDEDE] font-mono">Rohan Dental Clinic - Manhattan</span>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="border border-[#171717] bg-[#171717] rounded-[24px] p-6 relative overflow-hidden group transition-all duration-300 flex flex-col justify-between h-full shadow-2xl opacity-90 hover:opacity-100 hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#F25623] text-sm">★</span>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#DEDEDE] leading-relaxed font-medium italic">
                "The Anti-Footprint GPS Dispersal module is an absolute game-changer. We scatter our geocoding pins naturally around our Chicago legal offices, avoiding automated spam triggers."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 border-t border-[#4D4D4D] mt-6">
              <div className="w-9 h-9 rounded-full bg-[#4D4D4D] border border-[#4D4D4D] flex items-center justify-center font-bold text-white text-xs font-mono">
                JD
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Jane D.</h4>
                <span className="text-[9px] text-[#DEDEDE] font-mono">Oak & Iron Lawyers - Chicago</span>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="border border-[#171717] bg-[#171717] rounded-[24px] p-6 relative overflow-hidden group transition-all duration-300 flex flex-col justify-between h-full shadow-2xl opacity-90 hover:opacity-100 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#F25623] text-sm">★</span>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#DEDEDE] leading-relaxed font-medium italic">
                "Crawling client pages bulk and compressing heavy photograph payloads is a breeze now. LocalLens AI compresses assets WebP lossless while maintaining perfect EXIF header tags."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 border-t border-[#4D4D4D] mt-6">
              <div className="w-9 h-9 rounded-full bg-[#4D4D4D] border border-[#4D4D4D] flex items-center justify-center font-bold text-white text-xs font-mono">
                AK
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Alex K.</h4>
                <span className="text-[9px] text-[#DEDEDE] font-mono">SEO Mastery Agency</span>
              </div>
            </div>
          </div>

        </div>
      
      </div>
    </section>
  );
};

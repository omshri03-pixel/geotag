"use client";

import React from "react";
import Link from "next/link";
import { Compass, ChevronRight } from "lucide-react";

export const CTA = () => {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-6 pt-6 pb-20 relative w-full">
      <div className="w-12 h-12 rounded-full bg-[#F25623]/20 border border-[#F25623]/30 flex items-center justify-center mx-auto mb-4 shadow shadow-[#F25623]/10">
        <Compass className="w-6 h-6 text-[#F25623] animate-spin [animation-duration:12s]" />
      </div>
      
      <h2 className="text-3xl md:text-6xl font-black text-[#DEDEDE] tracking-tight leading-tight font-sans">
        Ready to Dominate <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F25623] via-[#ff7c4d] to-[#F25623]">Google Map Packs?</span>
      </h2>
      
      <p className="text-xs sm:text-base text-[#DEDEDE] max-w-xl mx-auto leading-relaxed font-medium px-2">
        Stop uploading plain camera files. Optimize coordinate dispersal radius constraints inside image EXIF headers and secure your local page ranks instantly.
      </p>

      <div className="pt-6">
        <Link 
          href="/login" 
          className="bg-[#F25623] hover:from-[#ff751a] hover:to-[#F25623] text-[#171717] font-black px-8 py-4.5 rounded-full text-sm transition-all inline-flex items-center gap-2 shadow-2xl shadow-[#F25623]/20 hover:scale-[1.02] active:scale-95 duration-200"
        >
          Launch Your Workspace Free <ChevronRight className="w-4.5 h-4.5" />
        </Link>
      </div>
    </div>
  );
};

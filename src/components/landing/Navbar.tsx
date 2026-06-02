"use client";

import React from "react";
import Link from "next/link";
import { Navigation, ArrowRight } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[94%] max-w-6xl z-[60] rounded-full border border-[#4D4D4D]/30 bg-[#171717]/85 backdrop-blur-xl px-4 sm:px-6 py-3 flex justify-between items-center transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#F25623] flex items-center justify-center shadow-lg transition-transform hover:rotate-45 duration-300 shrink-0">
          <Navigation className="text-[#171717] w-4.5 h-4.5 font-bold" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-xs sm:text-sm tracking-tight text-[#DEDEDE] leading-none">LocalLens AI</span>
          <span className="text-[7.5px] text-[#F25623] font-mono tracking-widest mt-1 uppercase font-black hidden xs:block">EXIF GPS Core v2.2</span>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-[11px] font-bold text-[#DEDEDE]/70">
        <a href="#features" className="hover:text-[#DEDEDE] transition-colors">Map Features</a>
        <a href="#how-it-works" className="hover:text-[#DEDEDE] transition-colors">How It Works</a>
        <a href="#pipeline" className="hover:text-[#DEDEDE] transition-colors">Tagging Pipeline</a>
        <a href="#sandbox" className="hover:text-[#DEDEDE] transition-colors">Map Sandbox</a>
        <a href="#deployments" className="hover:text-[#DEDEDE] transition-colors">Deployments</a>
        <a href="#pricing" className="hover:text-[#DEDEDE] transition-colors">Pricing</a>
      </nav>
      
      <div className="flex items-center gap-3">
        <Link 
          href="/login" 
          className="relative group bg-[#F25623] text-[#171717] text-[10px] sm:text-[11px] font-black px-4 sm:px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg shadow-[#F25623]/20 cursor-pointer overflow-hidden shrink-0"
        >
          <span className="relative z-10 flex items-center gap-1">
            Launch Suite <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </header>
  );
};

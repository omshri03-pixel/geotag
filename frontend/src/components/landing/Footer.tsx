"use client";

import React from "react";
import Link from "next/link";
import { Navigation } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full">
      {/* Deep Grid Footer */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 pt-16 border-t border-[#4D4D4D] mt-16 text-left relative z-10">
        
        {/* Branding Column */}
        <div className="col-span-2 space-y-4 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#F25623] flex items-center justify-center">
              <Navigation className="text-[#171717] w-4.5 h-4.5 font-bold" />
            </div>
            <span className="font-extrabold text-sm text-[#DEDEDE]">LocalLens AI</span>
          </div>
          <p className="text-xs text-[#DEDEDE] max-w-xs leading-relaxed font-medium">
            Powerful EXIF geocoding and image metadata solutions to help your local business gain search pack dominance. Experience superior performance.
          </p>
        </div>

        {/* Products Column */}
        <div className="space-y-3 w-full">
          <span className="block text-[9px] font-black text-[#DEDEDE] uppercase tracking-wider font-mono">Products</span>
          <ul className="text-xs space-y-2 text-[#DEDEDE] font-medium">
            <li><Link href="/products/campaigns-sync" className="hover:text-[#DEDEDE] transition-colors">Campaigns Sync</Link></li>
            <li><Link href="/products/bulk-gps-injection" className="hover:text-[#DEDEDE] transition-colors">Bulk GPS Injection</Link></li>
            <li><Link href="/products/location-presets" className="hover:text-[#DEDEDE] transition-colors">Location Presets</Link></li>
          </ul>
        </div>

        {/* Company Column */}
        <div className="space-y-3 w-full">
          <span className="block text-[9px] font-black text-[#DEDEDE] uppercase tracking-wider font-mono">Company</span>
          <ul className="text-xs space-y-2 text-[#DEDEDE] font-medium">
            <li><Link href="/about" className="hover:text-[#DEDEDE] transition-colors">About Us</Link></li>
            <li><Link href="/case-studies" className="hover:text-[#DEDEDE] transition-colors">Case Studies</Link></li>
            <li><Link href="/press" className="hover:text-[#DEDEDE] transition-colors">Press Room</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-3 w-full">
          <span className="block text-[9px] font-black text-[#DEDEDE] uppercase tracking-wider font-mono">Contact</span>
          <ul className="text-xs space-y-2 text-[#DEDEDE] font-mono font-medium text-[10px]">
            <li>support@locallensai.com</li>
            <li>+1 (555) 0199-8800</li>
          </ul>
        </div>

      </div>

      {/* Subfooter */}
      <div className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#DEDEDE] pt-8 border-t border-[#4D4D4D] mt-8 relative z-10 w-full mb-8">
        <span>&copy; {new Date().getFullYear()} LocalLens AI. All rights reserved.</span>
        <div className="flex gap-4 mt-4 sm:mt-0 font-medium">
          <Link href="/dashboard" className="hover:text-[#DEDEDE] transition-colors">Workspace</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#DEDEDE] transition-colors">Terms & Services</Link>
        </div>
      </div>
    </footer>
  );
};

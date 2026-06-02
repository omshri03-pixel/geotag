"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-white">
      <div className="max-w-7xl mx-auto w-full">
      
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <span className="text-[#171717] font-mono text-xs uppercase tracking-widest font-black bg-[#171717]/5 border border-[#171717]/10 px-3.5 py-1.5 rounded-full inline-block shadow-sm">
          Flexible Scaling
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#171717] leading-tight font-sans">
          Scale Custom Map Listings
        </h2>
        <p className="text-[#666666] text-sm sm:text-base max-w-xl mx-auto font-medium px-2">
          Scale your local campaigns. Upgrade seamlessly as your client accounts and location lists expand.
        </p>
      </div>

      {/* 3 Column Glass Cards (Stacks beautifully on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 max-w-5xl mx-auto w-full">
        
        {/* Card 1 */}
        <div className="bg-[#F5F5F5] rounded-[28px] p-6 sm:p-8 border border-[#E5E5E5] flex flex-col justify-between space-y-8 hover:border-[#171717]/20 transition-all duration-300 relative text-left w-full hover:shadow-lg">
          <div className="space-y-4">
            <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider font-mono bg-[#E5E5E5] border border-[#DEDEDE] px-2.5 py-1 rounded-full inline-block">Starter Package</span>
            <p className="text-4xl font-extrabold text-[#171717]">₹0 <span className="text-xs font-normal text-[#666666]">/ forever</span></p>
            <p className="text-xs text-[#666666] leading-relaxed font-medium">
              Perfect for individual business owners looking to optimize coordinates on their single storefront.
            </p>
          </div>
          
          <ul className="text-xs space-y-3.5 text-[#171717] pt-6 border-t border-[#E5E5E5] font-medium">
            <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#F25623] shrink-0" /> 10 Images processed / day</li>
            <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#F25623] shrink-0" /> Basic EXIF Geotagging</li>
            <li className="flex items-center gap-2.5 text-[#A3A3A3]"><CheckCircle2 className="w-4 h-4 text-[#DEDEDE] shrink-0" /> No bulk website URL scraping</li>
            <li className="flex items-center gap-2.5 text-[#A3A3A3]"><CheckCircle2 className="w-4 h-4 text-[#DEDEDE] shrink-0" /> No saved locations preset history</li>
          </ul>

          <Link href="/login" className="w-full bg-white hover:bg-[#F0F0F0] border border-[#E5E5E5] text-center text-xs font-extrabold py-3.5 rounded-full transition-all block text-[#171717] shadow-sm">
            Get Started Free
          </Link>
        </div>

        {/* Card 2: Highlighted Pro with dark background */}
        <div className="bg-[#171717] rounded-[28px] p-6 sm:p-8 border-2 border-[#F25623] flex flex-col justify-between space-y-8 relative shadow-2xl text-left w-full lg:scale-105 z-10">
          <div className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#F25623] text-white font-mono shadow-md">Popular</div>
          
          <div className="space-y-4">
            <span className="text-[9px] font-bold text-[#F25623] uppercase tracking-wider font-mono bg-[#F25623]/10 border border-[#F25623]/20 px-2.5 py-1 rounded-full inline-block">Pro Optimizer</span>
            <p className="text-4xl font-extrabold text-white">₹999 <span className="text-xs font-normal text-[#DEDEDE]">/ month</span></p>
            <p className="text-xs text-[#DEDEDE] leading-relaxed font-medium">
              Designed for professional freelance SEO consultants managing up to 10 local client listings.
            </p>
          </div>
          
          <ul className="text-xs space-y-3.5 text-white pt-6 border-t border-[#F25623]/20 font-medium">
            <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#F25623] shrink-0" /> 1,000 Images / month</li>
            <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#F25623] shrink-0" /> WebP/AVIF conversions output</li>
            <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#F25623] shrink-0" /> Website URL batch image scraping</li>
            <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#F25623] shrink-0" /> Unlimited pre-saved location coordinates</li>
          </ul>

          <Link href="/login" className="w-full bg-[#F25623] hover:bg-[#D94C1D] text-center text-white text-xs font-black py-3.5 rounded-full transition-all block shadow-lg">
            Start Pro Experience
          </Link>
        </div>
        
        {/* Card 3 */}
        <div className="bg-[#F5F5F5] rounded-[28px] p-6 sm:p-8 border border-[#E5E5E5] flex flex-col justify-between space-y-8 hover:border-[#171717]/20 transition-all duration-300 relative text-left w-full md:col-span-2 lg:col-span-1 hover:shadow-lg">
          <div className="space-y-4">
            <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider font-mono bg-[#E5E5E5] border border-[#DEDEDE] px-2.5 py-1 rounded-full inline-block">Agency Bundle</span>
            <p className="text-4xl font-extrabold text-[#171717]">₹4,999 <span className="text-xs font-normal text-[#666666]">/ month</span></p>
            <p className="text-xs text-[#666666] leading-relaxed font-medium">
              Perfect for local marketing agencies managing multiple multi-store retail client campaigns.
            </p>
          </div>
          
          <ul className="text-xs space-y-3.5 text-[#171717] pt-6 border-t border-[#E5E5E5] font-medium">
            <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#F25623] shrink-0" /> Unlimited Bulk Uploads & Logs</li>
            <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#F25623] shrink-0" /> Full Database Workspace Sync</li>
            <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#F25623] shrink-0" /> Custom ALT text templates generator</li>
            <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#F25623] shrink-0" /> Priority API access for automated tag jobs</li>
          </ul>

          <Link href="/login" className="w-full bg-white hover:bg-[#F0F0F0] border border-[#E5E5E5] text-center text-xs font-extrabold py-3.5 rounded-full transition-all block text-[#171717] shadow-sm">
            Get Agency Bundle
          </Link>
        </div>
      </div>
      
      </div>
    </section>
  );
};

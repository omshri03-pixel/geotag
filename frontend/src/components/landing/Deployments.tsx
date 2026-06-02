"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navigation, MapPin, Globe, Compass, Map } from "lucide-react";

export const Deployments = () => {
  return (
    <section id="deployments" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#DEDEDE]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Left Column: Orbital Compass dial presets visual (Fully responsive scaling) */}
          <div className="col-span-1 lg:col-span-5 flex items-center justify-center relative py-8 lg:py-0 w-full overflow-hidden">
            
            {/* Outer Grid glow */}
            <div className="absolute w-[280px] sm:w-[350px] h-[280px] sm:h-[350px] bg-[#F25623]/20 blur-3xl rounded-full" />
            
            {/* Responsive scaling dial container */}
            <div className="relative w-[260px] h-[260px] sm:w-[330px] sm:h-[330px] md:w-[380px] md:h-[380px] rounded-full border border-[#171717]/10 flex items-center justify-center shrink-0">
              
              <div className="absolute inset-0 rounded-full border border-dashed border-[#171717]/20 animate-spin [animation-duration:40s]" />
              
              <div className="absolute top-1 text-[8px] font-mono text-[#171717] tracking-wider font-bold">N 0°</div>
              <div className="absolute bottom-1 text-[8px] font-mono text-[#171717] tracking-wider font-bold">S 180°</div>
              <div className="absolute right-1 text-[8px] font-mono text-[#171717] tracking-wider font-bold">E 90°</div>
              <div className="absolute left-1 text-[8px] font-mono text-[#171717] tracking-wider font-bold">W 270°</div>

              {/* Core logo badge */}
              <div className="w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26 rounded-full bg-[#171717] flex flex-col items-center justify-center text-white shadow-xl z-20 shrink-0">
                <Navigation className="w-6 h-6 sm:w-7 sm:h-7 text-[#F25623] animate-pulse" />
                <span className="text-[8px] sm:text-[8.5px] font-black tracking-widest uppercase mt-1">GeoTagger</span>
              </div>

              {/* Inner floating orbital path */}
              <div className="absolute w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] rounded-full border border-[#171717]/10" />

              {/* Orbital icons circular paths */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                className="absolute inset-0 z-10 pointer-events-none"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-[#171717]/10 flex items-center justify-center shadow-md shadow-[#171717]/5">
                  <MapPin className="w-3.5 h-3.5 text-[#F25623]" />
                </div>
              </motion.div>

              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
                className="absolute inset-0 z-10 pointer-events-none"
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-[#171717]/10 flex items-center justify-center shadow-md shadow-[#171717]/5">
                  <Globe className="w-3.5 h-3.5 text-[#171717]" />
                </div>
              </motion.div>

              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 26, ease: "linear", delay: 3 }}
                className="absolute inset-0 z-10 pointer-events-none"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#171717]/10 flex items-center justify-center shadow-md shadow-[#171717]/5">
                  <Compass className="w-3.5 h-3.5 text-[#171717] animate-spin [animation-duration:6s]" />
                </div>
              </motion.div>

              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear", delay: 1 }}
                className="absolute inset-0 z-10 pointer-events-none"
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-[#171717]/10 flex items-center justify-center shadow-md shadow-[#171717]/5">
                  <Map className="w-3.5 h-3.5 text-[#F25623]" />
                </div>
              </motion.div>

            </div>

            {/* Floating indicator title */}
            <div className="absolute bottom-[-15px] bg-[#171717] border border-[#171717]/20 rounded-full px-4 py-2 text-[9px] sm:text-[10px] text-[#DEDEDE] font-bold font-mono tracking-widest shadow-xl backdrop-blur z-20 uppercase text-center w-[90%] max-w-[340px] truncate">
              ✦ Synced with 50+ Local SEO Map Directories
            </div>

          </div>

          {/* Right Column: High contrast descriptive details */}
          <div className="col-span-1 lg:col-span-7 text-left space-y-8 w-full">
            
            <div className="space-y-4">
              <span className="text-[#171717] font-mono text-xs uppercase tracking-widest font-black bg-[#171717]/5 border border-[#171717]/10 px-3.5 py-1.5 rounded-full inline-block shadow-sm">
                Deployment Tiers
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight leading-tight font-sans">
                Flexible Architectures For Diverse Deployments
              </h2>
              <p className="text-[#4D4D4D] text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
                Whether you manage single business listings or operate a large multi-location franchise agency ecosystem, LocalLens AI scale fits your pipeline seamlessly.
              </p>
            </div>

            {/* Columns listing (Stacks on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 w-full">
              
              <div className="space-y-3.5 border-l-2 border-[#171717]/20 pl-5 w-full">
                <span className="text-[9px] text-[#F25623] font-mono font-bold uppercase tracking-wider bg-[#F25623]/10 px-2 rounded-full py-0.5">Tier 01</span>
                <h4 className="font-extrabold text-sm text-[#171717] font-sans">IT & SEO Agencies</h4>
                <ul className="space-y-2 text-[10.5px] text-[#4D4D4D] font-mono leading-relaxed font-medium">
                  <li><span className="text-[#171717]">✦</span> Generative ALT Tags</li>
                  <li><span className="text-[#171717]">✦</span> Proxy URL Scraping</li>
                  <li><span className="text-[#171717]">✦</span> Unlimited API Queries</li>
                  <li><span className="text-[#171717]">✦</span> Full History Sync Logs</li>
                </ul>
              </div>

              <div className="space-y-3.5 border-l-2 border-[#171717]/20 pl-5 w-full">
                <span className="text-[9px] text-[#171717] font-mono font-bold uppercase tracking-wider bg-[#171717]/10 px-2 rounded-full py-0.5">Tier 02</span>
                <h4 className="font-extrabold text-sm text-[#171717] font-sans">Multi-Store Brands</h4>
                <ul className="space-y-2 text-[10.5px] text-[#4D4D4D] font-mono leading-relaxed font-medium">
                  <li><span className="text-[#F25623]">✦</span> Random GPS Scatter</li>
                  <li><span className="text-[#F25623]">✦</span> Pre-Saved Locations</li>
                  <li><span className="text-[#F25623]">✦</span> WebP/AVIF Convert</li>
                  <li><span className="text-[#F25623]">✦</span> Multi-Listing Accounts</li>
                </ul>
              </div>

              <div className="space-y-3.5 border-l-2 border-[#171717]/20 pl-5 w-full">
                <span className="text-[9px] text-[#F25623] font-mono font-bold uppercase tracking-wider bg-[#F25623]/10 px-2 rounded-full py-0.5">Tier 03</span>
                <h4 className="font-extrabold text-sm text-[#171717] font-sans">Independent Pros</h4>
                <ul className="space-y-2 text-[10.5px] text-[#4D4D4D] font-mono leading-relaxed font-medium">
                  <li><span className="text-[#171717]">✦</span> Live Camera Uploads</li>
                  <li><span className="text-[#171717]">✦</span> Distance Matrix Presets</li>
                  <li><span className="text-[#171717]">✦</span> Simple EXIF Tags</li>
                  <li><span className="text-[#171717]">✦</span> Mobile Workspace</li>
                </ul>
              </div>

            </div>

            <div className="pt-8 border-t border-[#171717]/10 flex flex-wrap items-center gap-4 text-[9px] font-mono font-bold text-[#4D4D4D] uppercase tracking-widest w-full">
              <span>Google Maps Pack</span>
              <span className="text-[#F25623]">✦</span>
              <span>Apple Maps Connect</span>
              <span className="text-[#171717]">✦</span>
              <span>OpenStreetMap</span>
              <span className="text-[#F25623]">✦</span>
              <span>Yelp Local Directory</span>
              <span className="text-[#171717]">✦</span>
              <span>Bing Places Grid</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

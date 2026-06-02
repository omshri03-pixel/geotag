"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map, ImageIcon, AlertCircle, Layers, Navigation, MapPin, CheckCircle2 } from "lucide-react";

export const Dataflow = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.35 }}
      className="w-full max-w-5xl mt-8 sm:mt-10 relative z-20 px-1 sm:px-4 mx-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#F25623]/10 to-transparent rounded-[32px] -z-10 blur-xl opacity-35" />
      
      <div className="border border-[#4D4D4D] bg-[#171717]/95 rounded-[32px] p-4 sm:p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
        
        {/* Header simulated dashboard details */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#4D4D4D] mb-6 gap-3 text-left w-full">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/50 shrink-0" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30 border border-yellow-500/50 shrink-0" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/30 border border-green-500/50 shrink-0" />
            <span className="text-[10px] text-[#DEDEDE] font-mono ml-1 uppercase font-black tracking-wider flex items-center gap-1.5 truncate">
              <Map className="w-3.5 h-3.5 text-[#F25623] shrink-0" /> Mapbox EXIF Injection Module v2.2
            </span>
          </div>
          <div className="px-2.5 py-0.5 rounded bg-[#0A0A10] border border-[#4D4D4D] text-[8.5px] sm:text-[9.5px] text-[#DEDEDE] font-mono tracking-wider shrink-0">
            COMPASS GRID INDEX: NY_MANHATTAN_01
          </div>
        </div>

        {/* Geographic dataflow pipeline (Responsive grid stacking) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative text-left">
          
          {/* Box 1: Raw Image Card */}
          <div className="col-span-1 lg:col-span-4 border border-[#4D4D4D] bg-[#08080D] rounded-2xl p-4 sm:p-5 relative overflow-hidden group w-full">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.05),transparent)]" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4.5 h-4.5 text-red-400" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-[#DEDEDE] uppercase tracking-wider">raw_clinic_gallery.png</h4>
                <span className="text-[8px] sm:text-[8.5px] text-red-400 font-mono font-bold tracking-wide uppercase">❌ Empty GPS Headers</span>
              </div>
            </div>

            <div className="w-full aspect-[16/10] bg-[#171717] border border-[#4D4D4D] rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#1f1f2e_1px,transparent_1px)] [background-size:16px_16px] opacity-45" />
              <ImageIcon className="w-8 h-8 text-[#DEDEDE]/5" />
              <div className="absolute bottom-2 left-2 bg-[#171717]/90 border border-[#4D4D4D] px-2 py-0.5 rounded text-[8px] font-mono text-[#DEDEDE]">
                28.4 MB (JPEG Payload)
              </div>
            </div>

            <div className="space-y-2 text-[9.5px] sm:text-[10px] font-mono">
              <div className="flex items-center gap-2 text-red-400/90 bg-red-500/5 px-2.5 py-1.5 rounded border border-red-500/10">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>EXIF GPS Coordinates: NULL</span>
              </div>
              <div className="flex items-center gap-2 text-red-400/90 bg-red-500/5 px-2.5 py-1.5 rounded border border-red-500/10">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Metadata Presets: Empty</span>
              </div>
              <div className="flex items-center gap-2 text-[#DEDEDE] bg-[#12121A] px-2.5 py-1.5 rounded border border-[#4D4D4D]">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>Page Load Penalty: Heavy payload</span>
              </div>
            </div>
          </div>

          {/* Box 2: Center Geotag injection core */}
          <div className="col-span-1 lg:col-span-4 flex flex-col items-center justify-center text-center relative py-4 lg:py-0 w-full">
            <div className="w-22 h-22 rounded-full bg-[#F25623]/20 border border-[#F25623]/30 flex items-center justify-center relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-[#F25623]/30 flex items-center justify-center pointer-events-none"
              >
                <div className="absolute top-1 text-[7px] font-bold text-[#F25623]/40">N</div>
                <div className="absolute bottom-1 text-[7px] font-bold text-[#F25623]/40">S</div>
              </motion.div>
              <div className="w-14 h-14 rounded-full bg-[#F25623]/20 border border-[#F25623]/30 flex items-center justify-center">
                <Navigation className="w-5.5 h-5.5 text-[#F25623]" />
              </div>
            </div>

            <div className="mt-5 space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#DEDEDE]">Geotag Engine Core</h4>
              <p className="text-[10px] text-[#DEDEDE] max-w-[200px] leading-relaxed font-medium">
                Reads target addresses, extracts precise coordinate offsets, and injects clean EXIF GPS tags bulk.
              </p>
            </div>

            {/* Pulse lines */}
            <div className="hidden lg:block absolute left-[-20px] top-1/2 -translate-y-1/2 w-[60px] h-[2px]">
              <div className="w-full h-full bg-gradient-to-r from-red-500/30 to-[#F25623]/30 relative">
                <motion.div 
                  animate={{ left: ["0%", "100%"] }} 
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F25623] shadow shadow-brand"
                />
              </div>
            </div>
            
            <div className="hidden lg:block absolute right-[-20px] top-1/2 -translate-y-1/2 w-[60px] h-[2px]">
              <div className="w-full h-full bg-gradient-to-r from-[#F25623]/30 to-cyan-500/30 relative">
                <motion.div 
                  animate={{ left: ["0%", "100%"] }} 
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow shadow-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Box 3: Synchronized Map and Pin visual */}
          <div className="col-span-1 lg:col-span-4 border border-[#4D4D4D] bg-[#08080D] rounded-2xl p-4 sm:p-5 relative overflow-hidden group w-full">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.05),transparent)]" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#4D4D4D] border border-[#4D4D4D] flex items-center justify-center shrink-0">
                <MapPin className="w-4.5 h-4.5 text-[#DEDEDE]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-[#DEDEDE] uppercase tracking-wider">Google Maps Synced</h4>
                <span className="text-[8px] sm:text-[8.5px] text-[#DEDEDE] font-mono font-bold tracking-wide uppercase">✅ Metadata Embedded</span>
              </div>
            </div>

            <div className="w-full aspect-[16/10] bg-[#171717] border border-[#4D4D4D] rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#16222e_1.5px,transparent_1.5px)] [background-size:18px_18px] opacity-70" />
              
              {/* Radar wave ping */}
              <div className="absolute w-12 h-12 rounded-full border border-[#F25623]/30 bg-[#F25623]/20 animate-ping [animation-duration:2.5s]" />
              <MapPin className="w-5.5 h-5.5 text-[#F25623] relative z-10 animate-bounce" />

              {/* Coords label */}
              <div className="absolute bottom-2 left-2 bg-[#171717]/95 border border-[#4D4D4D] px-2 py-0.5 rounded text-[8px] font-mono text-[#DEDEDE] font-bold">
                GPS SYNCED: 40.7128° N, -74.0060° W
              </div>
            </div>

            <div className="space-y-2 text-[9.5px] sm:text-[10px] font-mono">
              <div className="flex items-center gap-2 text-[#DEDEDE]/90 bg-[#4D4D4D] px-2.5 py-1.5 rounded border border-[#4D4D4D]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DEDEDE] shrink-0" />
                <span>EXIF GPS Coordinate Verify: OK</span>
              </div>
              <div className="flex items-center gap-2 text-[#DEDEDE]/90 bg-[#4D4D4D] px-2.5 py-1.5 rounded border border-[#4D4D4D]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DEDEDE] shrink-0" />
                <span>Alt Keyword Schemas Active</span>
              </div>
              <div className="flex items-center gap-2 text-[#F25623]/90 bg-[#F25623]/20 px-2.5 py-1.5 rounded border border-[#F25623]/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F25623] shrink-0" />
                <span>WebP Format Output (-91.2% Payload)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#4D4D4D]/20 text-left w-full">
          <div className="p-4 rounded-xl bg-[#171717] border border-[#4D4D4D]/30 shadow-md">
            <span className="block text-xl sm:text-2xl font-black text-[#DEDEDE] font-mono">1.5M+</span>
            <span className="text-[9px] text-[#DEDEDE] uppercase tracking-widest font-mono font-bold mt-1 block">📍 Photos Geotagged</span>
          </div>
          <div className="p-4 rounded-xl bg-[#171717] border border-[#4D4D4D]/30 shadow-md">
            <span className="block text-xl sm:text-2xl font-black text-[#F25623] font-mono">90%+</span>
            <span className="text-[9px] text-[#DEDEDE] uppercase tracking-widest font-mono font-bold mt-1 block">🎯 Image Payload Saved</span>
          </div>
          <div className="p-4 rounded-xl bg-[#171717] border border-[#4D4D4D]/30 shadow-md">
            <span className="block text-xl sm:text-2xl font-black text-[#DEDEDE] font-mono">100%</span>
            <span className="text-[9px] text-[#DEDEDE] uppercase tracking-widest font-mono font-bold mt-1 block">🗺️ Mapbox Grid Sync</span>
          </div>
          <div className="p-4 rounded-xl bg-[#171717] border border-[#4D4D4D]/30 shadow-md">
            <span className="block text-xl sm:text-2xl font-black text-[#DEDEDE] font-mono">5.5k+</span>
            <span className="text-[9px] text-[#DEDEDE] uppercase tracking-widest font-mono font-bold mt-1 block">💼 SEO Agencies Connected</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

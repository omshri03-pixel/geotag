"use client";

import React from "react";
import { ImageIcon, MapPin, Compass, Sliders, CheckCircle2 } from "lucide-react";

interface PipelineProps {
  activeWorkflowStep: number;
}

export const Pipeline = ({ activeWorkflowStep }: PipelineProps) => {
  return (
    <section id="pipeline" className="py-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 bg-[#F25623] text-[#171717]">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <span className="text-[#171717] font-mono text-xs uppercase tracking-widest font-black bg-[#171717]/10 border border-[#171717]/20 px-3.5 py-1.5 rounded-full inline-block">
            Pipeline Sequence
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#171717] leading-tight font-sans">
            The 5-Step Pin-Drop Pipeline
          </h2>
          <p className="text-[#171717] text-sm sm:text-base max-w-xl mx-auto font-medium px-2">
            How our geocentric system converts standard camera photos into ranking search engine listing assets.
          </p>
        </div>

        {/* Step Cards (Stacks elegantly on mobile and tablet) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative text-left w-full">
          
          {/* Connector dashed line inside background for desktop */}
          <div className="hidden lg:block absolute top-[50px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-[#F25623]/20 via-cyan-400/20 to-[#F25623]/20 border-t border-dashed border-[#171717]/20 -z-10" />

          {/* Step 1 */}
          <div className={`border rounded-[24px] p-6 transition-all duration-300 relative bg-white/90 w-full h-full flex flex-col ${activeWorkflowStep === 0 ? "border-[#F25623] shadow-lg shadow-[#F25623]/10" : "border-[#171717]/20"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs mb-5 ${activeWorkflowStep === 0 ? "bg-[#171717] text-white" : "bg-white/90 text-[#171717]"}`}>
              01
            </div>
            <h4 className="font-extrabold text-xs text-[#171717] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <ImageIcon className="w-3.5 h-3.5 text-[#171717]" /> 1. Upload Assets
            </h4>
            <p className="text-[11px] text-[#171717] leading-relaxed font-medium">
              Drag in clinic/attorney raw camera uploads or enter target URL scraper presets.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`border rounded-[24px] p-6 transition-all duration-300 relative bg-white/90 w-full h-full flex flex-col ${activeWorkflowStep === 1 ? "border-[#171717]/20 shadow-lg shadow-cyan-400/5" : "border-[#171717]/20"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs mb-5 ${activeWorkflowStep === 1 ? "bg-cyan-400 text-[#171717]" : "bg-white/90 text-[#171717]"}`}>
              02
            </div>
            <h4 className="font-extrabold text-xs text-[#171717] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <MapPin className="w-3.5 h-3.5 text-[#171717]" /> 2. Preset Match
            </h4>
            <p className="text-[11px] text-[#171717] leading-relaxed font-medium">
              Geocode storefront coordinates using Mapbox or search manually using physical address.
            </p>
          </div>

          {/* Step 3 */}
          <div className={`border rounded-[24px] p-6 transition-all duration-300 relative bg-white/90 w-full h-full flex flex-col ${activeWorkflowStep === 2 ? "border-[#F25623] shadow-lg shadow-[#F25623]/10" : "border-[#171717]/20"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs mb-5 ${activeWorkflowStep === 2 ? "bg-[#171717] text-white" : "bg-white/90 text-[#171717]"}`}>
              03
            </div>
            <h4 className="font-extrabold text-xs text-[#171717] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <Compass className="w-3.5 h-3.5 text-[#171717]" /> 3. GPS Scatter
            </h4>
            <p className="text-[11px] text-[#171717] leading-relaxed font-medium">
              Configure coordinates scattering offset parameters to avoid footprints.
            </p>
          </div>

          {/* Step 4 */}
          <div className={`border rounded-[24px] p-6 transition-all duration-300 relative bg-white/90 w-full h-full flex flex-col ${activeWorkflowStep === 3 ? "border-[#171717]/20 shadow-lg shadow-cyan-400/5" : "border-[#171717]/20"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs mb-5 ${activeWorkflowStep === 3 ? "bg-cyan-400 text-[#171717]" : "bg-white/90 text-[#171717]"}`}>
              04
            </div>
            <h4 className="font-extrabold text-xs text-[#171717] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <Sliders className="w-3.5 h-3.5 text-[#171717]" /> 4. Exif Compiler
            </h4>
            <p className="text-[11px] text-[#171717] leading-relaxed font-medium">
              Run ExifTool to inject coordinates, custom SEO ALT tags, and losslessly compress.
            </p>
          </div>

          {/* Step 5 */}
          <div className={`border rounded-[24px] p-6 transition-all duration-300 relative bg-white/90 w-full h-full flex flex-col md:col-span-2 lg:col-span-1 ${activeWorkflowStep === 4 ? "border-[#F25623] shadow-lg shadow-[#F25623]/10" : "border-[#171717]/20"}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs mb-5 ${activeWorkflowStep === 4 ? "bg-[#171717] text-white" : "bg-white/90 text-[#171717]"}`}>
              05
            </div>
            <h4 className="font-extrabold text-xs text-[#171717] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" /> 5. Rank Sync
            </h4>
            <p className="text-[11px] text-[#171717] leading-relaxed font-medium">
              Download ZIP packages, publish to Map Packs, and track localized SEO metrics.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

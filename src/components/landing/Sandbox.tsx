"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface SandboxProps {
  handleStartScrape: () => void;
  isScraping: boolean;
  demoFormat: "webp" | "avif" | "original";
  setDemoFormat: (format: "webp" | "avif" | "original") => void;
  demoScatter: number;
  setDemoScatter: (val: number) => void;
  consoleLogs: string[];
  scrapeProgress: number;
  currentPins: { id: number; lat: number; lng: number; label: string }[];
  baseLat: number;
  baseLng: number;
  addLog: (msg: string) => void;
}

export const Sandbox = ({
  handleStartScrape,
  isScraping,
  demoFormat,
  setDemoFormat,
  demoScatter,
  setDemoScatter,
  consoleLogs,
  scrapeProgress,
  currentPins,
  baseLat,
  baseLng,
  addLog,
}: SandboxProps) => {
  return (
    <section id="sandbox" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border border-[#F25623]/30 bg-[#171717] rounded-[40px] w-full mb-16 shadow-2xl shadow-[#F25623]/5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        
        {/* Left Column: Descriptive block with coordinate details */}
        <div className="col-span-1 lg:col-span-4 text-left space-y-6 w-full">
          <span className="text-[#F25623] font-mono text-xs uppercase tracking-widest font-black bg-[#F25623]/20 border border-[#F25623]/30 px-3.5 py-1.5 rounded-full inline-block">
            Geocentric Map Simulation
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#DEDEDE] tracking-tight leading-[1.15] font-sans">
            Experience Interactive Preset Map Scattering
          </h2>
          <p className="text-[#DEDEDE] text-xs sm:text-sm leading-relaxed font-medium">
            Adjust the <strong>GPS Dispersal Radius</strong> using the panel controls. Watch in real-time as the mock pin coordinates disperse randomly around your base Manhattan listing coordinates to simulate organic footprint uploads!
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 text-xs">
              <div className="w-5 h-5 rounded-full bg-[#F25623]/20 border border-[#F25623]/30 flex items-center justify-center text-[#F25623] font-black shrink-0 mt-0.5">✓</div>
              <p className="text-[#DEDEDE] leading-snug font-medium"><strong className="text-[#DEDEDE]">Coordinate Scatter Sim:</strong> Disperses pin coordinates to mock organic reviews.</p>
            </div>
            <div className="flex items-start gap-3 text-xs">
              <div className="w-5 h-5 rounded-full bg-[#F25623]/20 border border-[#F25623]/30 flex items-center justify-center text-[#F25623] font-black shrink-0 mt-0.5">✓</div>
              <p className="text-[#DEDEDE] leading-snug font-medium"><strong className="text-[#DEDEDE]">Active Mapbox API logs:</strong> Simulates live Mapbox geocoding query routing.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Interactive Map UI panel (Fully responsive widths) */}
        <div className="col-span-1 lg:col-span-8 border border-[#4D4D4D] bg-[#171717] rounded-[24px] p-3 sm:p-6 backdrop-blur-xl relative w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F25623]/5 to-cyan-500/5 rounded-[24px] pointer-events-none -z-10" />
          
          {/* Header simulated controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#4D4D4D] pb-4 mb-6 text-left w-full">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1F]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1F]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1F]" />
              </div>
              <span className="text-[8px] text-[#F25623] bg-[#F25623]/20 border border-[#F25623]/30 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ml-1 shrink-0">
                Interactive Workspace v2.2
              </span>
            </div>
            <span className="text-[9.5px] sm:text-[10px] text-[#DEDEDE] font-mono truncate max-w-[280px]">MAP: https://locallensai.com/workspace/nyc</span>
          </div>

          {/* Sandbox grid split: settings panel and map preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left w-full">
            
            {/* Left Column Settings block */}
            <div className="col-span-1 md:col-span-6 space-y-4 w-full">
              
              {/* Input target URL */}
              <div className="bg-[#0A0A10] border border-[#4D4D4D] rounded-xl p-4 space-y-3 w-full">
                <label className="text-[8.5px] font-mono font-bold text-[#DEDEDE] uppercase tracking-wider block">🌐 Active Target Scrape URL</label>
                <div className="flex gap-2 w-full">
                  <input 
                    type="text" 
                    readOnly 
                    value="https://www.rohandental.com/gallery" 
                    className="bg-[#171717] border border-[#4D4D4D] rounded-lg px-2.5 py-2 text-[10.5px] sm:text-xs text-[#DEDEDE] font-mono flex-1 min-w-0 focus:outline-none"
                  />
                  <button 
                    onClick={handleStartScrape}
                    disabled={isScraping}
                    className="bg-[#F25623] text-[#171717] text-xs font-black px-3.5 py-2 rounded-lg hover:opacity-90 transition-all shadow-md shadow-[#F25623]/15 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isScraping ? "Scraping..." : "Run Scrape"}
                  </button>
                </div>
              </div>

              {/* Simulated Format Output settings */}
              <div className="bg-[#0A0A10] border border-[#4D4D4D] rounded-xl p-4 space-y-3 w-full">
                <label className="text-[8.5px] font-mono font-bold text-[#DEDEDE] uppercase tracking-wider block">⚙️ EXIF Output Compression Format</label>
                <div className="grid grid-cols-3 gap-2 w-full">
                  {(["original", "webp", "avif"] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => {
                        setDemoFormat(format);
                        addLog(`[SETTINGS] Compression preset changed to: ${format.toUpperCase()}`);
                      }}
                      className={`py-2 rounded-lg text-[9px] font-black border transition-all cursor-pointer ${
                        demoFormat === format 
                          ? "bg-[#F25623]/20 border-[#F25623] text-[#F25623] font-black" 
                          : "bg-[#171717] border-[#4D4D4D] text-[#DEDEDE] hover:text-[#DEDEDE]"
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scatter radius slider setting */}
              <div className="bg-[#0A0A10] border border-[#4D4D4D] rounded-xl p-4 space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <label className="text-[8.5px] font-mono font-bold text-[#DEDEDE] uppercase tracking-wider block">🎯 GPS Pin Dispersal Radius</label>
                  <span className="text-xs font-bold text-[#F25623] font-mono">±{demoScatter}m</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={demoScatter}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setDemoScatter(val);
                    addLog(`[COORDINATES] Dispersal radius updated to: ±${val}m`);
                  }}
                  className="w-full accent-brand bg-[#171717] h-1.5 rounded cursor-pointer"
                />
              </div>

            </div>

            {/* Right Column: Visual satellite map representation showing scattered pins */}
            <div className="col-span-1 md:col-span-6 flex flex-col gap-4 w-full">
              
              {/* Visual scattered map card */}
              <div className="bg-[#08080C] border border-[#4D4D4D] rounded-xl p-3 flex-1 min-h-[260px] relative overflow-hidden flex flex-col justify-between w-full">
                <span className="text-[8.5px] font-mono font-bold text-[#DEDEDE] uppercase tracking-wider block border-b border-[#4D4D4D] pb-2 mb-2 relative z-10">
                  🗺️ Live Manhattan Map Sandbox Grid
                </span>

                {/* Map Grid base lines */}
                <div className="absolute inset-0 bg-[#0E0E14] opacity-80 z-0 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#1f1f2e_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-60 z-0 pointer-events-none" />
                
                {/* Coordinate labels */}
                <div className="absolute top-10 left-2 text-[7px] text-[#DEDEDE] font-mono z-10 select-none pointer-events-none">40.7130° N</div>
                <div className="absolute bottom-2 left-2 text-[7px] text-[#DEDEDE] font-mono z-10 select-none pointer-events-none">40.7126° N</div>
                <div className="absolute top-10 right-2 text-[7px] text-[#DEDEDE] font-mono z-10 select-none pointer-events-none">-74.0055° W</div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-[#4D4D4D] flex items-center justify-center pointer-events-none select-none z-0">
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#4D4D4D] animate-spin [animation-duration:30s]" />
                  <span className="text-[7.5px] text-[#DEDEDE]/40 absolute top-0 font-mono">N</span>
                  <span className="text-[7.5px] text-[#DEDEDE]/40 absolute bottom-0 font-mono">S</span>
                </div>

                {/* Base original center point pin drop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
                  <div className="w-5 h-5 rounded-full bg-[#4D4D4D] border border-[#4D4D4D] flex items-center justify-center relative animate-pulse">
                    <div className="w-2 rounded-full bg-cyan-400 h-2" />
                  </div>
                  <span className="text-[6.5px] font-mono text-[#DEDEDE] font-bold bg-[#171717]/95 px-1 py-0.5 rounded border border-[#4D4D4D] mt-1 select-none">
                    BASE PRESET
                  </span>
                </div>

                {/* Dynamic scattered pins based on slider position */}
                {currentPins.map((pin) => (
                  <motion.div
                    key={pin.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      x: (pin.lng - baseLng) * 160000, 
                      y: -(pin.lat - baseLat) * 160000 
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none"
                  >
                    <MapPin className="w-5.5 h-5.5 text-[#F25623] drop-shadow" />
                    <div className="max-w-[70px] truncate text-[6px] font-mono text-[#DEDEDE] bg-[#171717]/95 px-1 py-0.5 rounded border border-[#F25623]/30 mt-0.5 shadow-md">
                      {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
                    </div>
                  </motion.div>
                ))}

                <div className="mt-auto relative z-10 text-[8px] font-mono text-[#DEDEDE] bg-[#171717]/90 px-2 py-1 rounded border border-[#4D4D4D]">
                  📍 Preset coordinates active: Manhattan dental clinic
                </div>
              </div>

              {/* Simulator compile logs terminal */}
              <div className="bg-[#0A0A10] border border-[#4D4D4D] rounded-xl p-3 h-[130px] flex flex-col justify-between w-full">
                <span className="text-[8.5px] font-mono font-bold text-[#DEDEDE] uppercase tracking-wider block border-b border-[#4D4D4D] pb-1.5 mb-1.5">
                  ⚙️ Active Compile geocoding logs
                </span>

                <div className="flex-1 overflow-y-auto font-mono text-[9px] space-y-1.5 custom-scrollbar text-[#DEDEDE] leading-relaxed pr-1">
                  {consoleLogs.length === 0 ? (
                    <span className="text-[#DEDEDE] italic block">Click "Run Scrape" above to process simulated geocoding runs...</span>
                  ) : (
                    consoleLogs.map((log, idx) => (
                      <div key={idx} className={log.startsWith("[MAP") ? "text-[#DEDEDE] font-bold" : log.startsWith("[SCRAPER]") ? "text-[#F25623]" : log.startsWith("[EXIF") ? "text-[#F25623] font-bold" : "text-[#7EE787]"}>
                        {log}
                      </div>
                    ))
                  )}
                </div>

                {isScraping && (
                  <div className="w-full bg-[#171717] h-1 rounded-full overflow-hidden mt-2 border border-[#4D4D4D]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${scrapeProgress}%` }}
                      className="h-full bg-[#F25623]"
                    />
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

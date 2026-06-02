"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, ArrowLeft, Sliders, CheckCircle2, Map, ShieldCheck, Compass, Eye } from "lucide-react";

export default function LocationPresetsPage() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const presets = [
    {
      id: "nyc",
      name: "NYC Manhattan Preset",
      client: "Prescott Dental Clinic",
      coords: "40.7128° N, -74.0060° W",
      altitude: "12.4m",
      heading: "N 12° E",
    },
    {
      id: "chi",
      name: "CHI Chicago Preset",
      client: "Chicago Trial Law Firm",
      coords: "41.8781° N, -87.6298° W",
      altitude: "185.2m",
      heading: "S 45° W",
    },
    {
      id: "hou",
      name: "HOU Houston Preset",
      client: "Houston Real Estate Group",
      coords: "29.7604° N, -95.3698° W",
      altitude: "24.1m",
      heading: "N 89° E",
    },
  ];

  const handleTestScan = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPreset(preset.name);
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      setScanResult(
        `✓ [MAPBOX SYNCED] Preset [${preset.name}] successfully verified! Stamping target parameters: Coordinates: [${preset.coords}], Altitude: [${preset.altitude}], Heading: [${preset.heading}]. [SUCCESS]`
      );
    }, 900);
  };

  return (
    <div className="min-h-screen bg-bg text-text-main relative overflow-hidden flex flex-col justify-between font-sans selection:bg-brand selection:text-black">
      
      {/* Topographic Background & Spotlight */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F0F1E_1px,transparent_1px),linear-gradient(to_bottom,#0F0F1E_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[94%] max-w-6xl z-[60] rounded-full border border-white/[0.08] bg-[#05050A]/85 backdrop-blur-xl px-4 sm:px-6 py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.7)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-[#C084FC] flex items-center justify-center shadow-lg shadow-violet-500/20 transition-transform group-hover:rotate-45 duration-300 shrink-0">
            <Navigation className="text-black w-4.5 h-4.5 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white leading-none">LocalLens AI</span>
            <span className="text-[7.5px] text-violet-400 font-mono tracking-widest mt-1 uppercase font-black">EXIF GPS Core v2.2</span>
          </div>
        </Link>
        
        <Link 
          href="/" 
          className="text-[11px] font-extrabold text-zinc-400 hover:text-white transition-colors tracking-wide flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex-grow">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12 text-left"
        >
          {/* Header */}
          <div className="space-y-4">
            <span className="text-violet-400 font-mono text-[10px] uppercase tracking-widest font-black bg-violet-500/10 border border-violet-500/20 px-3.5 py-1.5 rounded-full inline-block">
              Preset Libraries
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-sans">
              Location Presets Manager
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Formulate, save, and manage altitude matrices, GPS dispersion radius presets, and custom search optimization variables inside client metadata files bulk.
            </p>
          </div>

          {/* Preset Manager Grid Simulator */}
          <div className="border border-white/[0.08] bg-[#05050A]/95 rounded-[32px] p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.03),transparent_70%)] pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-violet-400" /> MOCK PRESET DATABASE SYNC
                </span>
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase font-mono tracking-wider ${
                  scanning ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse" :
                  selectedPreset ? "bg-violet-500/15 border border-violet-500/30 text-violet-400" :
                  "bg-white/5 border border-white/10 text-zinc-400"
                }`}>
                  {scanning ? "SCANNING TARGET..." : selectedPreset ? "PRESET SCAN OK" : "DATABASE READY"}
                </span>
              </div>

              {/* Table of Presets */}
              <div className="overflow-x-auto border border-white/[0.04] rounded-xl bg-[#020205]/60">
                <table className="min-w-full text-[10px] sm:text-xs text-left font-mono text-zinc-400">
                  <thead className="bg-[#05050A] text-zinc-500 border-b border-white/[0.04]">
                    <tr>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Preset Name</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Target Client</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider">Coordinates</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {presets.map((preset) => (
                      <tr key={preset.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-4 py-3.5 text-white font-extrabold font-sans">{preset.name}</td>
                        <td className="px-4 py-3.5 text-zinc-300">{preset.client}</td>
                        <td className="px-4 py-3.5 font-mono text-[10.5px] text-violet-400">{preset.coords}</td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleTestScan(preset.id)}
                            disabled={scanning}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-extrabold px-3 py-1.5 rounded-lg transition-all text-[10px] flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Eye className="w-3 h-3" /> Test Preset
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mock Terminal scan output */}
              <div className="bg-[#020205] border border-white/[0.04] rounded-xl p-4 min-h-[90px] font-mono text-[10px] text-zinc-400 flex items-center text-left">
                {scanning ? (
                  <span className="text-amber-400 block animate-pulse">⚙ Scanning coordinate mapping boundaries... please wait...</span>
                ) : scanResult ? (
                  <span className="text-violet-400 font-bold block">{scanResult}</span>
                ) : (
                  <span className="text-zinc-600 italic block">// Click "Test Preset" on any row above to scan coordinates target matrices...</span>
                )}
              </div>

            </div>
          </div>

          {/* Product details grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-violet-500/40 transition-colors duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-sm font-extrabold text-white mb-2">Altitude Control</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                Embed altitude matrices parameters into EXIF headers to comply with modern geocoding pack crawlers.
              </p>
            </div>

            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-cyan-400/40 transition-colors duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-sm font-extrabold text-white mb-2">Metadata Templates</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                Saves custom title headings, tags, descriptions, and comments alongside geocoded EXIF markers bulk.
              </p>
            </div>

            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-violet-500/40 transition-colors duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                <Map className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-sm font-extrabold text-white mb-2">Mapbox API Sync</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                Verifies target address parameters instantly using high-speed Mapbox search API routing protocols.
              </p>
            </div>

          </div>

        </motion.div>

      </main>

      {/* Reusable Subfooter */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-400 font-medium font-sans">
        <span>&copy; {new Date().getFullYear()} LocalLens AI. All rights reserved.</span>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="/dashboard" className="hover:text-white transition-colors">Workspace</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white transition-colors">Terms & Services</Link>
        </div>
      </footer>

    </div>
  );
}

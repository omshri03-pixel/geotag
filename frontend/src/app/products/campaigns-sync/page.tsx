"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, ArrowLeft, RefreshCw, Server, CheckCircle2, ShieldCheck, MapPin, Play } from "lucide-react";

export default function CampaignsSyncPage() {
  const [syncStatus, setSyncStatus] = useState<"idle" | "running" | "success">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const runSyncSimulation = () => {
    setSyncStatus("running");
    setLogs([]);
    const simulatedLogs = [
      "[SYSTEM] Initializing geo-tagging synchronization sequence...",
      "[CONNECT] Connecting to Mapbox Geocoding Grid API...",
      "[API] Authentication verified. Mapbox instance: ACTIVE",
      "[QUERY] Fetching active multi-location presets history...",
      "[SYNC] Prescott Clinic, Manhattan (40.7128° N, -74.0060° W) - EXIF STAMPS: EMPTY",
      "[WARN] Local listing authority degradation threat: HIGH",
      "[ACTION] Injecting target coordinate matrices bulk...",
      "[COMPILE] Processing 25 gallery JPEGs ➔ WebP payload conversion...",
      "[GPS] Coordinates offset randomizer dispersals set (Radius: 25m)",
      "[WRITE] Stamped EXIF altitude: 12.4m, direction heading: N 12° E",
      "[VERIFY] Run ExifTool audit: EXIF HEADER PARSE OK",
      "[SUCCESS] Map Pack synchronizing sequence 100% COMPLETE!",
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < simulatedLogs.length) {
        setLogs((prev) => [...prev, simulatedLogs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setSyncStatus("success");
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-bg text-text-main relative overflow-hidden flex flex-col justify-between font-sans selection:bg-brand selection:text-black">
      
      {/* Topographic Background & Spotlight */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F0F1E_1px,transparent_1px),linear-gradient(to_bottom,#0F0F1E_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[94%] max-w-6xl z-[60] rounded-full border border-white/[0.08] bg-[#05050A]/85 backdrop-blur-xl px-4 sm:px-6 py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.7)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform group-hover:rotate-45 duration-300 shrink-0">
            <Navigation className="text-black w-4.5 h-4.5 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white leading-none">LocalLens AI</span>
            <span className="text-[7.5px] text-emerald-400 font-mono tracking-widest mt-1 uppercase font-black">EXIF GPS Core v2.2</span>
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
            <span className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest font-black bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full inline-block">
              Automation Systems
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-sans">
              Google Business Sync
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Synchronize physical addresses, dynamic target coordinates, alt description parameters, and verified bulk media assets directly to active GBP API terminals without extra steps.
            </p>
          </div>

          {/* campaigns compiler visualizer simulator */}
          <div className="border border-white/[0.08] bg-[#05050A]/95 rounded-[32px] p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-emerald-400" /> PIPELINE SYNCHRONIZER TERMINAL
                </span>
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase font-mono tracking-wider ${
                  syncStatus === "idle" ? "bg-white/5 border border-white/10 text-zinc-400" :
                  syncStatus === "running" ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse" :
                  "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                }`}>
                  {syncStatus === "idle" ? "API CONNECTION IDLE" : syncStatus === "running" ? "UPLOADING MEDIA..." : "API TRANSFER OK"}
                </span>
              </div>

              {/* Mock Terminal compiler output */}
              <div className="bg-[#020205] border border-white/[0.04] rounded-xl p-4 min-h-[180px] max-h-[220px] overflow-y-auto font-mono text-[10px] text-zinc-400 space-y-2 text-left">
                {logs.length === 0 ? (
                  <span className="text-zinc-600 block italic">// Click "Trigger Live Sync Connection" below to execute simulated automated API push workflow...</span>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className={log && log.includes("[SUCCESS]") ? "text-emerald-400 font-bold" : log && log.includes("[WARN]") ? "text-amber-400" : "text-zinc-300"}>
                      {log}
                    </div>
                  ))
                )}
              </div>

              {/* Action bar details */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/[0.04]">
                <div className="text-left">
                  <span className="block text-xs font-extrabold text-white">Preset target: Prescott Clinic</span>
                  <span className="text-[10px] text-zinc-500 font-medium">Manhattan storefront coordinates presets</span>
                </div>
                <button
                  onClick={runSyncSimulation}
                  disabled={syncStatus === "running"}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-[#10B981] text-black font-black px-6 py-3 rounded-full text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 hover:scale-[1.02] active:scale-95 duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-black ${syncStatus === "running" ? "animate-spin" : ""}`} /> 
                  {syncStatus === "idle" ? "Trigger Live Sync Connection" : syncStatus === "running" ? "Synchronizing..." : "Simulate Sync Again"}
                </button>
              </div>

            </div>
          </div>

          {/* Product details grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-emerald-400/40 transition-colors duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-extrabold text-white mb-2">Live Google API</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                Uses official OAuth 2.0 protocols to feed images directly into your client Google listings without manual entry.
              </p>
            </div>

            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-cyan-400/40 transition-colors duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-sm font-extrabold text-white mb-2">Safe Verification</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                Protects list authority against Google algorithm updates by verifying coordinate metadata integrity before posting.
              </p>
            </div>

            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-emerald-400/40 transition-colors duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-extrabold text-white mb-2">Live Post Preview</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                Simulates real-world search pack appearance so you can check file layouts and title strings before publishing.
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

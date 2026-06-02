"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navigation, ArrowLeft, Image, Play, CheckCircle2, ChevronRight, Sliders, Database } from "lucide-react";

export default function BulkGpsInjectionPage() {
  const [injectStatus, setInjectStatus] = useState<"idle" | "running" | "success">("idle");
  const [progress, setProgress] = useState(0);
  const [outputFiles, setOutputFiles] = useState<string[]>([]);

  const runBatchSimulation = () => {
    setInjectStatus("running");
    setProgress(0);
    setOutputFiles([]);

    const coordinatePool = [
      "41.8781° N, -87.6298° W",
      "41.8784° N, -87.6295° W",
      "41.8778° N, -87.6301° W",
      "41.8789° N, -87.6305° W",
      "41.8773° N, -87.6289° W",
    ];

    let currentFileCount = 0;
    const totalFiles = 50;

    const interval = setInterval(() => {
      if (currentFileCount < totalFiles) {
        currentFileCount += 5;
        const randomCoord = coordinatePool[Math.floor(Math.random() * coordinatePool.length)];
        setProgress((currentFileCount / totalFiles) * 100);
        setOutputFiles((prev) => [
          ...prev,
          `✓ raw_clinic_gallery_photo_${currentFileCount - 4}.jpg ➔ stamped: [${randomCoord}] ➔ output: photo_${currentFileCount - 4}.webp (-91.2% size)`,
          `✓ raw_clinic_gallery_photo_${currentFileCount - 3}.jpg ➔ stamped: [${randomCoord}] ➔ output: photo_${currentFileCount - 3}.webp (-90.8% size)`,
          `✓ raw_clinic_gallery_photo_${currentFileCount - 2}.jpg ➔ stamped: [${randomCoord}] ➔ output: photo_${currentFileCount - 2}.webp (-91.5% size)`,
          `✓ raw_clinic_gallery_photo_${currentFileCount - 1}.jpg ➔ stamped: [${randomCoord}] ➔ output: photo_${currentFileCount - 1}.webp (-91.1% size)`,
          `✓ raw_clinic_gallery_photo_${currentFileCount}.jpg ➔ stamped: [${randomCoord}] ➔ output: photo_${currentFileCount}.webp (-90.9% size)`,
        ]);
      } else {
        clearInterval(interval);
        setInjectStatus("success");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-bg text-text-main relative overflow-hidden flex flex-col justify-between font-sans selection:bg-brand selection:text-black">
      
      {/* Topographic Background & Spotlight */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F0F1E_1px,transparent_1px),linear-gradient(to_bottom,#0F0F1E_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[radial-gradient(circle_at_top,rgba(0,229,255,0.08)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-[94%] max-w-6xl z-[60] rounded-full border border-white/[0.08] bg-[#05050A]/85 backdrop-blur-xl px-4 sm:px-6 py-3 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.7)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-[#FF8533] flex items-center justify-center shadow-lg shadow-brand/20 transition-transform group-hover:rotate-45 duration-300 shrink-0">
            <Navigation className="text-black w-4.5 h-4.5 font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white leading-none">LocalLens AI</span>
            <span className="text-[7.5px] text-cyan-400 font-mono tracking-widest mt-1 uppercase font-black">EXIF GPS Core v2.2</span>
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
            <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest font-black bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1.5 rounded-full inline-block">
              Dynamic Metadata Injections
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight font-sans">
              Bulk GPS Injection Core
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Incorporate latitudinal, longitudinal, and altitudinal coordinate points bulk. Convert multiple heavy JPEGs/PNGs into compressed, lightweight search-compliant WebP files.
            </p>
          </div>

          {/* Interactive Batch Sandbox */}
          <div className="border border-white/[0.08] bg-[#05050A]/95 rounded-[32px] p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.03),transparent_70%)] pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-2">
                  <Image className="w-3.5 h-3.5 text-cyan-400" /> BATCH EXIF INJECTOR DEMO
                </span>
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase font-mono tracking-wider ${
                  injectStatus === "idle" ? "bg-white/5 border border-white/10 text-zinc-400" :
                  injectStatus === "running" ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 animate-pulse" :
                  "bg-brand/15 border border-brand/30 text-brand"
                }`}>
                  {injectStatus === "idle" ? "READY" : injectStatus === "running" ? "COMPILING..." : "BATCH COMPLETE"}
                </span>
              </div>

              {/* Progress Bar container */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-zinc-400">
                  <span>Batch progress: {progress}%</span>
                  <span>{progress === 100 ? "50/50 Files Stamped" : `${Math.round((progress/100) * 50)} / 50 files`}</span>
                </div>
                <div className="w-full bg-[#101018] rounded-full h-2 overflow-hidden border border-white/[0.04]">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-brand h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Mock Terminal Output log */}
              <div className="bg-[#020205] border border-white/[0.04] rounded-xl p-4 min-h-[160px] max-h-[200px] overflow-y-auto font-mono text-[9px] text-zinc-400 space-y-1.5 text-left">
                {outputFiles.length === 0 ? (
                  <span className="text-zinc-600 block italic">// Click compile below to simulate a batch geocoding stamp (50 photos)...</span>
                ) : (
                  outputFiles.map((file, idx) => (
                    <div key={idx} className="text-cyan-400 animate-fade-in">
                      {file}
                    </div>
                  ))
                )}
              </div>

              {/* Action bar details */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/[0.04]">
                <div className="text-left">
                  <span className="block text-xs font-extrabold text-white">Preset coordinate: Chicago Law Office</span>
                  <span className="text-[10px] text-zinc-500 font-medium">Coordinate scatter parameters active (±25m)</span>
                </div>
                <button
                  onClick={runBatchSimulation}
                  disabled={injectStatus === "running"}
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-[#00A2FF] text-black font-black px-6 py-3 rounded-full text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/15 hover:scale-[1.02] active:scale-95 duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 text-black ${injectStatus === "running" ? "animate-pulse" : ""}`} /> 
                  {injectStatus === "idle" ? "Simulate Batch Injection" : injectStatus === "running" ? "Injecting coordinates..." : "Simulate Batch Again"}
                </button>
              </div>

            </div>
          </div>

          {/* Feature details grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-brand/40 transition-colors duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-sm font-extrabold text-white mb-2">Compacting Format</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                Saves up to 90%+ image payload storage sizes by converting massive raw JPEGs into modern WebP structures instantly.
              </p>
            </div>

            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-cyan-400/40 transition-colors duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-sm font-extrabold text-white mb-2">Zero Data Loss</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                Ensures exact coordinate headers, altitude matrices, and direction parameters are fully maintained during scaling.
              </p>
            </div>

            <div className="border border-white/[0.06] bg-[#05050A] rounded-[24px] p-6 relative overflow-hidden group hover:border-brand/40 transition-colors duration-300 text-left">
              <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-4">
                <Database className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-sm font-extrabold text-white mb-2">PostgreSQL Grid sync</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                Persists your batch metadata presets dynamically. Audit offsets, manage folders, and download coordinate packages.
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

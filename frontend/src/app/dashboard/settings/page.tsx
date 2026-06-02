"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, ShieldAlert, FolderOpen, ImageIcon, 
  MapPin, Settings, LogOut, Save, Sliders, FileText, Database, ShieldCheck,
  Plus, Trash2, Globe, Star, Sparkles, Navigation
} from "lucide-react";
import { getApiUrl } from "@/lib/utils";

interface SavedLocation {
  id?: number;
  name: string;
  lat: number;
  lng: number;
  city: string;
}

export default function WorkspaceSettings() {
  const router = useRouter();
  
  // State variables for agency preferences
  const [userName, setUserName] = useState("Marketer");
  const [userPlan, setUserPlan] = useState("Free");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [userId, setUserId] = useState("1");

  // Editable settings parameters
  const [businessName, setBusinessName] = useState("");
  const [defaultKeywords, setDefaultKeywords] = useState("");
  const [coordinatePrecision, setCoordinatePrecision] = useState("5");
  const [renamePattern, setRenamePattern] = useState("{businessName}-{keyword}-{number}");
  const [altTextPattern, setAltTextPattern] = useState("{businessName} - {keyword}");
  const [loading, setLoading] = useState(false);

  // PostgreSQL-Synced Presets State
  const [presets, setPresets] = useState<SavedLocation[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetLat, setNewPresetLat] = useState("");
  const [newPresetLng, setNewPresetLng] = useState("");
  const [newPresetCity, setNewPresetCity] = useState("");
  const [addingPreset, setAddingPreset] = useState(false);

  // Fetch presets and auth data
  const fetchPresets = async (currentUserId: string) => {
    try {
      const API_URL = getApiUrl();
      const res = await fetch(`${API_URL}/api/settings?userId=${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        setPresets(data.locations || []);
      }
    } catch (err) {
      console.error("Failed to load presets:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("buzz_auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const currentUserId = localStorage.getItem("buzz_user_id") || "1";
    setUserId(currentUserId);
    setUserRole(localStorage.getItem("buzz_user_role") || "user");
    setUserName(localStorage.getItem("buzz_user_name") || "Marketer");
    setUserPlan(localStorage.getItem("buzz_user_plan") || "Free");
    setUserEmail(localStorage.getItem("buzz_user_email") || "");

    // Populate default templates if they exist in localStorage
    setBusinessName(localStorage.getItem("buzz_default_business") || localStorage.getItem("buzz_user_name") || "");
    setDefaultKeywords(localStorage.getItem("buzz_default_keywords") || "local SEO, GMB optimization");
    setCoordinatePrecision(localStorage.getItem("buzz_coordinate_precision") || "5");
    setRenamePattern(localStorage.getItem("buzz_rename_pattern") || "{businessName}-{keyword}-{number}");
    setAltTextPattern(localStorage.getItem("buzz_alt_text_pattern") || "{businessName} - {keyword}");

    fetchPresets(currentUserId);
  }, [router]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("buzz_default_business", businessName);
      localStorage.setItem("buzz_default_keywords", defaultKeywords);
      localStorage.setItem("buzz_coordinate_precision", coordinatePrecision);
      localStorage.setItem("buzz_rename_pattern", renamePattern);
      localStorage.setItem("buzz_alt_text_pattern", altTextPattern);
      
      setLoading(false);
      alert("Workspace settings and optimization templates updated successfully!");
    }, 800);
  };

  // Add a new preset dynamically to PostgreSQL
  const handleAddPreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName || !newPresetLat || !newPresetLng) {
      alert("Name, Latitude, and Longitude are required to create a preset shortcut.");
      return;
    }

    setAddingPreset(true);
    try {
      const API_URL = getApiUrl();
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPresetName,
          lat: parseFloat(newPresetLat),
          lng: parseFloat(newPresetLng),
          city: newPresetCity || "Dubai",
          userId: parseInt(userId)
        })
      });

      if (res.ok) {
        setNewPresetName("");
        setNewPresetLat("");
        setNewPresetLng("");
        setNewPresetCity("");
        await fetchPresets(userId);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to add preset.");
      }
    } catch (err) {
      console.error(err);
      alert("Error reaching settings API.");
    } finally {
      setAddingPreset(false);
    }
  };

  // Delete a preset from PostgreSQL
  const handleDeletePreset = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this custom saved preset?")) return;

    try {
      const API_URL = getApiUrl();
      const res = await fetch(`${API_URL}/api/settings?id=${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        await fetchPresets(userId);
      } else {
        alert("Failed to delete preset.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting preset.");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-main flex flex-col md:flex-row relative overflow-hidden font-sans">
      
      {/* Background Visual Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] [background-size:32px_32px] opacity-45 pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-full md:w-64 backdrop-blur-xl bg-bg-panel/90 border-b md:border-b-0 md:border-r border-border p-6 flex flex-col gap-8 flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-[#FF8533] flex items-center justify-center shadow-lg shadow-brand/20 transition-transform hover:rotate-45 duration-300 shrink-0">
            <Navigation className="text-black w-4.5 h-4.5 font-bold" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-extrabold text-base tracking-tight text-text-main leading-none">LocalLens AI</h1>
            <span className="text-[9px] text-brand font-bold uppercase tracking-widest mt-1 font-mono">SEO Workspace</span>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1.5 flex-grow">
          <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-text-muted hover:text-white hover:bg-bg-hover border border-transparent hover:border-border">
            <BarChart3 className="w-4 h-4 text-brand" />
            Dashboard Center
          </Link>
          {userRole === "superadmin" && (
            <Link href="/dashboard/admin" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-text-muted hover:text-white hover:bg-bg-hover border border-transparent hover:border-border">
              <ShieldAlert className="w-4 h-4 text-brand" />
              Admin Command Center
            </Link>
          )}
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black transition-all bg-brand/10 border border-brand/20 text-brand shadow-sm">
            <Settings className="w-4 h-4 text-brand" />
            Workspace Settings
          </div>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-border space-y-3">
          <div className="bg-bg p-3.5 rounded-lg border border-border space-y-3 shadow-md shadow-black/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-brand flex items-center justify-center font-bold text-xs text-[#000000] uppercase shadow">
                {userName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-extrabold text-xs text-text-main truncate leading-none mb-1">{userName}</p>
                <p className="text-[10px] text-text-muted truncate font-mono">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="px-2 py-0.5 rounded bg-brand/10 border border-brand/20 text-[9px] font-extrabold text-brand tracking-wider">
                {userPlan.toUpperCase()}
              </span>
              <button
                onClick={() => {
                  localStorage.clear();
                  router.push("/login");
                }}
                className="flex items-center gap-1 text-[10px] text-brand hover:text-brand/80 font-bold cursor-pointer"
                title="Log Out Session"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 z-10 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <header>
            <div className="flex items-center gap-2 text-xs text-text-muted mb-1 font-mono uppercase tracking-wider">
              <Settings className="w-3.5 h-3.5 text-brand" /> Agency Customization Hub
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-text-main flex items-center gap-2">
              Workspace Settings <Sparkles className="w-5 h-5 text-brand animate-pulse" />
            </h2>
            <p className="text-xs text-text-muted mt-1">Configure default metadata presets, batch renaming patterns, and local database details.</p>
          </header>

          {/* Active Presets (PostgreSQL Interfacing) */}
          <div className="bg-bg-panel rounded-xl p-6 border border-border space-y-5 shadow-xl relative">
            <h3 className="font-bold text-sm text-text-main flex items-center gap-2 border-b border-border pb-3">
              <MapPin className="w-4 h-4 text-brand" /> Synced GMB Location Presets (PostgreSQL)
            </h3>

            <div className="space-y-4">
              <p className="text-[11px] text-text-muted leading-relaxed">
                These geo-target presets sync directly to the PostgreSQL database server and can be instantly selected inside active project workspaces for automated EXIF injections:
              </p>

              <div className="border border-border rounded-xl overflow-hidden bg-bg/20">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-bg-panel border-b border-border text-[10px] text-text-muted uppercase font-bold tracking-wider">
                      <th className="p-3">Preset Name</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Latitude</th>
                      <th className="p-3">Longitude</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presets.map((preset) => (
                      <tr key={preset.id} className="border-b border-border hover:bg-bg-hover transition-colors">
                        <td className="p-3 font-semibold text-text-main">{preset.name}</td>
                        <td className="p-3 text-text-muted">{preset.city}</td>
                        <td className="p-3 font-mono text-brand/90">{preset.lat.toFixed(6)}</td>
                        <td className="p-3 font-mono text-brand/90">{preset.lng.toFixed(6)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => preset.id && handleDeletePreset(preset.id)}
                            className="text-brand hover:text-brand/80 transition-colors p-1 cursor-pointer"
                            title="Delete Preset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {presets.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-text-muted italic">
                          No location shortcuts defined. Add one below!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Form to add new location preset */}
              <form onSubmit={handleAddPreset} className="bg-bg/30 border border-border rounded-xl p-4 space-y-3">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-brand">➕ Add New SEO Target Preset</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-text-muted">Preset Name</label>
                    <input
                      type="text"
                      required
                      value={newPresetName}
                      onChange={e => setNewPresetName(e.target.value)}
                      className="w-full bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-brand"
                      placeholder="e.g. Dubai Marina Mall"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-text-muted">Target City</label>
                    <input
                      type="text"
                      value={newPresetCity}
                      onChange={e => setNewPresetCity(e.target.value)}
                      className="w-full bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-brand"
                      placeholder="e.g. Dubai"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-text-muted">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={newPresetLat}
                      onChange={e => setNewPresetLat(e.target.value)}
                      className="w-full bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-text-main focus:outline-none focus:border-brand"
                      placeholder="e.g. 25.07821"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-text-muted">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={newPresetLng}
                      onChange={e => setNewPresetLng(e.target.value)}
                      className="w-full bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-text-main focus:outline-none focus:border-brand"
                      placeholder="e.g. 55.14152"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={addingPreset}
                  className="bg-brand hover:bg-brand-hover text-[#000000] text-[11px] font-black px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> {addingPreset ? "Saving Preset..." : "Register Preset"}
                </button>
              </form>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Presets Card */}
            <div className="bg-bg-panel rounded-xl p-6 border border-border space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-text-main flex items-center gap-2 border-b border-border pb-3">
                <Sliders className="w-4 h-4 text-brand" /> Default SEO Templates & Presets
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-muted">Default Business/Client Name</label>
                  <input 
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand font-semibold"
                    placeholder="e.g. Rohan Dental Care"
                  />
                  <p className="text-[10px] text-text-muted/80">Used to pre-fill brand tags for bulk actions.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-muted">Default Focus Keywords</label>
                  <input 
                    type="text"
                    value={defaultKeywords}
                    onChange={e => setDefaultKeywords(e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand"
                    placeholder="e.g. dentist near me, root canal"
                  />
                  <p className="text-[10px] text-text-muted/80">Separate multiple terms with commas.</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-semibold text-text-muted">GPS Coordinate Precision decimals</label>
                <select
                  value={coordinatePrecision}
                  onChange={e => setCoordinatePrecision(e.target.value)}
                  className="bg-bg border border-border rounded-lg px-3 py-2.5 text-xs text-text-muted focus:outline-none focus:border-brand cursor-pointer w-full"
                >
                  <option value="5">5 Decimals (Standard Accuracy, ~1.1 meters)</option>
                  <option value="6">6 Decimals (High Precision, ~11 centimeters)</option>
                  <option value="7">7 Decimals (Extreme Precision, ~1.1 centimeters)</option>
                </select>
                <p className="text-[10px] text-text-muted/80">Defines coordinates resolution injected inside photos EXIF tags.</p>
              </div>
            </div>

            {/* Pattern Customizer Card */}
            <div className="bg-bg-panel rounded-xl p-6 border border-border space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-text-main flex items-center gap-2 border-b border-border pb-3">
                <FileText className="w-4 h-4 text-brand" /> Batch Renaming & ALT Customization
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-muted">Image Output Renaming Format</label>
                  <input 
                    type="text"
                    value={renamePattern}
                    onChange={e => setRenamePattern(e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand font-mono text-[10px]"
                    placeholder="{businessName}-{keyword}-{number}"
                  />
                  <p className="text-[10px] text-text-muted/80">Available dynamic keys: <code className="bg-bg border border-border px-1.5 py-0.5 rounded text-brand font-mono text-[9px]">{`{businessName}`}</code>, <code className="bg-bg border border-border px-1.5 py-0.5 rounded text-brand font-mono text-[9px]">{`{keyword}`}</code>, <code className="bg-bg border border-border px-1.5 py-0.5 rounded text-brand font-mono text-[9px]">{`{number}`}</code></p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-muted">Image Alt-Text preset format</label>
                  <input 
                    type="text"
                    value={altTextPattern}
                    onChange={e => setAltTextPattern(e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand font-mono text-[10px]"
                    placeholder="{businessName} - {keyword}"
                  />
                  <p className="text-[10px] text-text-muted/80">Automatically injected as IPTC/EXIF photo description header.</p>
                </div>
              </div>
            </div>

            {/* Database Credentials */}
            <div className="bg-bg-panel rounded-xl p-6 border border-border space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-text-main flex items-center gap-2 border-b border-border pb-3">
                <Database className="w-4 h-4 text-brand" /> Registered Database Credentials
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-text-muted block">Database Engine</span>
                  <span className="font-semibold text-white">PostgreSQL (v14+)</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-text-muted block">Server Location</span>
                  <span className="font-semibold text-white font-mono text-[11px]">localhost:5432</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-text-muted block">Schema</span>
                  <span className="font-semibold text-white font-mono text-[11px]">geotagger (public)</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-text-muted block">Session Security Status</span>
                  <span className="font-semibold text-brand flex items-center gap-1.5 text-[10px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand" /> Percent-Encoded Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-hover text-[#000000] text-xs font-black py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand/20 hover:scale-[1.01]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#000000]/30 border-t-[#000000] rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#000000]" /> Save Preferences & Presets
                </>
              )}
            </button>
            
          </form>

        </div>
      </main>
    </div>
  );
}

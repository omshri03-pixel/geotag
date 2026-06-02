"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderOpen, Plus, Image as ImageIcon, MapPin, 
  Trash2, ChevronRight, Settings, Users, LogOut, BarChart3, X, ShieldAlert, Sparkles, Globe, Navigation,
  Wand2, Copy, CheckCheck, Loader2, MessageSquare
} from "lucide-react";

interface Project {
  id: number;
  name: string;
  clientName: string;
  notes: string;
  createdAt: string;
  imageCount: number;
  successCount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const [userName, setUserName] = useState("Marketer");
  const [userPlan, setUserPlan] = useState("Free");
  const [userEmail, setUserEmail] = useState("");
  
  // Modal Fields
  const [newProject, setNewProject] = useState({
    name: "",
    clientName: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // AI Assistant State
  const [aiInput, setAiInput] = useState({ businessName: "", location: "", keywords: "", businessType: "" });
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAction, setAiAction] = useState<"generate_alt_text" | "generate_filenames" | "keyword_research">("generate_alt_text");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleAiGenerate = async () => {
    if (!aiInput.businessName || !aiInput.location) {
      alert("Please enter Business Name and Location.");
      return;
    }
    setAiLoading(true);
    setAiResults([]);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: aiAction,
          data: { ...aiInput, imageCount: 6, count: 6 }
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAiResults(data.data);
      } else {
        alert(data.error || "AI generation failed.");
      }
    } catch (e) {
      alert("Network error calling AI.");
    } finally {
      setAiLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Fetch Projects List
  const fetchProjects = async () => {
    try {
      const userId = localStorage.getItem("buzz_user_id") || "0";
      const role = localStorage.getItem("buzz_user_role") || "user";
      
      const res = await fetch(`/api/projects?userId=${userId}&role=${role}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("buzz_auth_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setUserRole(localStorage.getItem("buzz_user_role") || "user");
    setUserName(localStorage.getItem("buzz_user_name") || "Marketer");
    setUserPlan(localStorage.getItem("buzz_user_plan") || "Free");
    setUserEmail(localStorage.getItem("buzz_user_email") || "");
    fetchProjects();
  }, []);

  // Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    setSubmitting(true);
    try {
      const userId = localStorage.getItem("buzz_user_id") || "1";
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProject, userId })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.project) {
          setShowCreateModal(false);
          setNewProject({ name: "", clientName: "", notes: "" });
          router.push(`/projects/${data.project.id}`);
        }
      } else {
        alert("Failed to create project.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating project.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!window.confirm("Are you sure you want to delete this project? All associated processed images will be deleted from database logs.")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete project.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while deleting.");
    }
  };

  const totalProjects = projects.length;
  const totalProcessedImages = projects.reduce((acc, p) => acc + (p.imageCount || 0), 0);
  const totalSuccessfulImages = projects.reduce((acc, p) => acc + (p.successCount || 0), 0);

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
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black transition-all bg-brand/10 border border-brand/20 text-brand shadow-sm">
            <BarChart3 className="w-4 h-4 text-brand" />
            Dashboard Center
          </div>
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-text-muted hover:text-white hover:bg-bg-hover border border-transparent hover:border-border text-left cursor-pointer"
          >
            <Plus className="w-4 h-4 text-brand" />
            New Campaign Project
          </button>
          {userRole === "superadmin" && (
            <Link 
              href="/dashboard/admin" 
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-text-muted hover:text-white hover:bg-bg-hover border border-transparent hover:border-border"
            >
              <ShieldAlert className="w-4 h-4 text-brand" />
              Admin Command Center
            </Link>
          )}
          <Link 
            href="/dashboard/settings" 
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all text-text-muted hover:text-white hover:bg-bg-hover border border-transparent hover:border-border"
          >
            <Settings className="w-4 h-4" />
            Workspace Settings
          </Link>
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
        <div className="max-w-5xl mx-auto space-y-8">
          
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-text-main flex items-center gap-2">
                Welcome Back, {userName} <Sparkles className="w-5 h-5 text-brand animate-pulse" />
              </h2>
              <p className="text-xs text-text-muted">
                Optimizing metadata, formats & GPS scatters. Account Level: <span className="text-brand font-extrabold">{userPlan}</span>
              </p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-brand hover:bg-brand-hover text-[#000000] text-xs font-black px-5 py-3 rounded-lg transition-all flex items-center gap-2 self-start cursor-pointer shadow-lg shadow-brand/20 hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4 text-[#000000]" /> New Campaigns Project
            </button>
          </header>

          {/* Premium Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-bg-panel rounded-xl p-6 border border-border flex items-center justify-between relative overflow-hidden group">
              <div className="space-y-1.5 z-10">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Total Campaign Folders</span>
                <p className="text-4xl font-black text-text-main font-mono">{totalProjects}</p>
              </div>
              <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center shadow z-10">
                <FolderOpen className="w-6 h-6 text-brand" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-bg-panel rounded-xl p-6 border border-border flex items-center justify-between relative overflow-hidden group">
              <div className="space-y-1.5 z-10">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Compressed Images</span>
                <p className="text-4xl font-black text-text-main font-mono">{totalProcessedImages}</p>
              </div>
              <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center shadow z-10">
                <ImageIcon className="w-6 h-6 text-brand" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-bg-panel rounded-xl p-6 border border-border flex items-center justify-between relative overflow-hidden group">
              <div className="space-y-1.5 z-10">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">GPS Injection Health</span>
                <p className="text-4xl font-black text-text-main font-mono">
                  {totalProcessedImages > 0 ? ((totalSuccessfulImages / totalProcessedImages) * 100).toFixed(0) : "100"}<span className="text-xs text-text-muted font-normal">%</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-lg flex items-center justify-center shadow z-10">
                <Globe className="w-6 h-6 text-brand" />
              </div>
            </div>

          </div>

          {/* ── NVIDIA AI SEO Assistant Widget ── */}
          <div className="bg-bg-panel rounded-xl border border-border overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-extrabold text-sm text-text-main flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-brand animate-pulse" />
                AI SEO Content Generator
                <span className="text-[9px] font-mono text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-full">Powered by Llama 3.3 70B</span>
              </h3>
              <span className="text-[9px] text-green-400 font-mono bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">● NVIDIA NIM Active</span>
            </div>

            <div className="p-6 space-y-5">
              {/* Action selector */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "generate_alt_text", label: "ALT Text" },
                  { key: "generate_filenames", label: "File Names" },
                  { key: "keyword_research", label: "Keywords" },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { setAiAction(opt.key as any); setAiResults([]); }}
                    className={`text-[11px] font-bold px-4 py-2 rounded-lg border transition-all cursor-pointer ${
                      aiAction === opt.key
                        ? "bg-brand text-[#000000] border-brand shadow-md shadow-brand/20"
                        : "bg-bg text-text-muted border-border hover:border-brand/40 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Business Name *</label>
                  <input
                    value={aiInput.businessName}
                    onChange={e => setAiInput(p => ({ ...p, businessName: e.target.value }))}
                    placeholder="e.g. Rohan Dental Clinic"
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand transition-colors placeholder:text-[#444]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Location *</label>
                  <input
                    value={aiInput.location}
                    onChange={e => setAiInput(p => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Bandra West, Mumbai"
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand transition-colors placeholder:text-[#444]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Business Type</label>
                  <input
                    value={aiInput.businessType}
                    onChange={e => setAiInput(p => ({ ...p, businessType: e.target.value }))}
                    placeholder="e.g. Dental Clinic, Restaurant"
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand transition-colors placeholder:text-[#444]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Focus Keywords</label>
                  <input
                    value={aiInput.keywords}
                    onChange={e => setAiInput(p => ({ ...p, keywords: e.target.value }))}
                    placeholder="e.g. dentist mumbai, teeth whitening"
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand transition-colors placeholder:text-[#444]"
                  />
                </div>
              </div>

              <button
                onClick={handleAiGenerate}
                disabled={aiLoading}
                className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-[#000000] text-xs font-black px-5 py-3 rounded-lg transition-all cursor-pointer shadow-lg shadow-brand/20 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {aiLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating with AI...</>
                ) : (
                  <><Wand2 className="w-4 h-4" /> Generate with AI</>
                )}
              </button>

              {/* Results */}
              {aiResults.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border">
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Generated Results — Click to Copy</p>
                  <div className="space-y-2">
                    {aiResults.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => copyToClipboard(item, idx)}
                        className="flex items-center justify-between gap-3 bg-bg border border-border hover:border-brand/40 rounded-lg px-4 py-3 cursor-pointer group transition-all hover:bg-brand/5"
                      >
                        <span className="text-xs text-white font-medium flex-1">{item}</span>
                        <span className="shrink-0 text-[#555] group-hover:text-brand transition-colors">
                          {copiedIdx === idx ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projects Table & List Section */}
          <div className="bg-bg-panel rounded-xl p-6 border border-border space-y-5 shadow-xl relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-extrabold text-sm text-text-main flex items-center gap-2">
                <FolderOpen className="w-4.5 h-4.5 text-brand" /> Active SEO Campaign Archives
              </h3>
              <span className="text-[10px] text-text-muted font-mono bg-bg px-2.5 py-1 rounded-lg border border-border">
                PostgreSQL Persistence Active
              </span>
            </div>
            
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2.5 text-text-muted">
                <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono">Loading campaign clusters...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="py-16 text-center space-y-5 border border-dashed border-border rounded-xl bg-bg/50">
                <FolderOpen className="w-12 h-12 text-text-muted mx-auto opacity-60" />
                <div className="space-y-1.5">
                  <p className="text-sm font-extrabold text-text-main">No active workspaces configured</p>
                  <p className="text-xs text-text-muted max-w-[280px] mx-auto leading-relaxed">Create your first client project campaign to deploy geotagging and WebP compressions.</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-brand/10 hover:bg-brand/20 border border-brand/30 text-brand text-xs font-bold px-5 py-2.5 rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  Configure Campaign Now
                </button>
              </div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-bg/30">
                {projects.map((proj) => (
                  <Link 
                    key={proj.id} 
                    href={`/projects/${proj.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-bg-hover transition-all group cursor-pointer border-l-2 border-transparent hover:border-brand"
                  >
                    <div className="space-y-1.5 max-w-lg">
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-sm text-text-main group-hover:text-brand transition-colors">
                          {proj.name}
                        </span>
                        {proj.clientName && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-brand uppercase tracking-wider">
                            {proj.clientName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted truncate max-w-md">
                        {proj.notes || "No additional campaign description details set."}
                      </p>
                      <div className="text-[10px] text-text-muted flex gap-3 pt-1 font-mono">
                        <span>Created: {new Date(proj.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-text-main font-bold">{proj.imageCount} images tags</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 sm:mt-0 self-end sm:self-center">
                      <button 
                        onClick={(e) => handleDeleteProject(proj.id, e)}
                        className="p-2 text-text-muted hover:text-brand hover:bg-brand/10 rounded-lg transition-all cursor-pointer"
                        title="Delete Campaign Cluster"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-text-muted group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal - Create New Project Dialog */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-bg-panel border border-border w-full max-w-md rounded-xl shadow-2xl p-6 overflow-hidden flex flex-col gap-4 text-text-main"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-brand" /> Create Campaigns Workspace
                </h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-bg rounded-md text-text-muted hover:text-text-main transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-text-muted uppercase">Project Campaign Name <span className="text-brand">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={newProject.name}
                    onChange={e => setNewProject({...newProject, name: e.target.value})}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-brand transition-colors text-text-main font-semibold"
                    placeholder="e.g. Dr Joy Dental Clinic - BurJuman Photos"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-text-muted uppercase">Client / Target Brand</label>
                  <input 
                    type="text" 
                    value={newProject.clientName}
                    onChange={e => setNewProject({...newProject, clientName: e.target.value})}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-brand transition-colors text-text-main"
                    placeholder="e.g. Dr Joy Dental Clinic"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-text-muted uppercase">Campaign Notes / Keywords</label>
                  <textarea 
                    value={newProject.notes}
                    onChange={e => setNewProject({...newProject, notes: e.target.value})}
                    rows={3}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-brand transition-colors resize-none text-text-main"
                    placeholder="e.g. Meta images targeting BurJuman branch for local GMB SEO optimization campaign."
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="bg-bg hover:bg-bg-panel border border-border text-xs font-bold px-4 py-2.5 rounded-lg transition-colors text-text-main cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !newProject.name.trim()}
                    className="bg-brand hover:bg-brand-hover disabled:opacity-50 text-[#000000] text-xs font-black px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {submitting ? "Creating..." : "Deploy Campaign"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BarChart3, ShieldAlert, FolderOpen, ImageIcon, 
  MapPin, Trash2, ChevronLeft, ArrowLeft, RefreshCw,
  Search, CheckCircle2, AlertCircle, Settings, Users as UsersIcon, LogOut,
  DollarSign, TrendingUp, CreditCard, Landmark, Sparkles, Navigation
} from "lucide-react";
import { getApiUrl } from "@/lib/utils";

interface Log {
  id: number;
  originalFilename: string;
  outputFilename: string;
  fileSize: number;
  status: string;
  latitude: number;
  longitude: number;
  businessName: string | null;
  keywords: string | null;
  createdAt: string;
  projectName: string;
  projectId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  plan: string;
  role: string;
  createdAt: string;
}

interface Stats {
  projectsCount: number;
  imagesCount: number;
  successCount: number;
  failedCount: number;
  usersCount: number;
  mrr: number;
  arr: number;
  arpu: number;
}

export default function AdminCenter() {
  const router = useRouter();
  
  // User profile states
  const [userName, setUserName] = useState("Marketer");
  const [userPlan, setUserPlan] = useState("Free");
  const [userEmail, setUserEmail] = useState("");

  // Auth Protection
  useEffect(() => {
    const role = localStorage.getItem("buzz_user_role");
    if (role !== "superadmin") {
      alert("Access Denied: Admin privileges required.");
      router.push("/dashboard");
      return;
    }

    setUserName(localStorage.getItem("buzz_user_name") || "Marketer");
    setUserPlan(localStorage.getItem("buzz_user_plan") || "Free");
    setUserEmail(localStorage.getItem("buzz_user_email") || "");
  }, [router]);

  const [stats, setStats] = useState<Stats>({
    projectsCount: 0,
    imagesCount: 0,
    successCount: 0,
    failedCount: 0,
    usersCount: 0,
    mrr: 0,
    arr: 0,
    arpu: 0
  });
  const [logs, setLogs] = useState<Log[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"logs" | "users">("logs");
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadData = async () => {
    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const res = await fetch(`${API_URL}/api/admin/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setLogs(data.logs || []);
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm("WARNING: Are you sure you want to permanently clear all image processing database logs? This action cannot be undone.")) return;

    try {
      const API_URL = getApiUrl();
      const res = await fetch(`${API_URL}/api/admin/clean`, { method: "DELETE" });
      if (res.ok) {
        alert("Logs cleared successfully.");
        loadData();
      } else {
        alert("Failed to clear logs.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while clearing database logs.");
    }
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesText = 
      log.originalFilename.toLowerCase().includes(filterText.toLowerCase()) ||
      log.projectName.toLowerCase().includes(filterText.toLowerCase()) ||
      (log.businessName && log.businessName.toLowerCase().includes(filterText.toLowerCase()));
      
    const matchesStatus = 
      filterStatus === "all" || 
      log.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesText && matchesStatus;
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(filterText.toLowerCase()) ||
      user.role.toLowerCase().includes(filterText.toLowerCase())
    );
  });

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
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-black transition-all bg-brand/10 border border-brand/20 text-brand shadow-sm">
            <ShieldAlert className="w-4 h-4 text-brand" />
            Admin Command Center
          </div>
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
            <div>
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1 font-mono uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-brand" /> Agency Administrator Panel
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-text-main flex items-center gap-2">
                System Control Center <Sparkles className="w-5 h-5 text-brand animate-pulse" />
              </h2>
              <p className="text-xs text-text-muted mt-1">Monitor cross-client geo-tagging traffic, maintain Postgres databases, and clear metadata logs.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={loadData}
                className="bg-bg-panel hover:bg-bg-hover border border-border p-2.5 rounded-lg transition-colors text-text-muted hover:text-white cursor-pointer shadow"
                title="Refresh Metrics"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button 
                onClick={handleClearLogs}
                disabled={logs.length === 0}
                className="bg-brand/10 hover:bg-brand/20 border border-brand/30 text-brand text-xs font-bold px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow"
              >
                <Trash2 className="w-4 h-4" /> Reset Database Logs
              </button>
            </div>
          </header>

          {/* SaaS Core stats */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">Core Platform Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-bg-panel border border-border rounded-lg p-4 space-y-1 shadow">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider flex items-center gap-1.5"><FolderOpen className="w-3 h-3 text-brand" /> Total Clients</span>
                <p className="text-2xl font-black text-text-main font-mono">{stats.projectsCount}</p>
              </div>
              <div className="bg-bg-panel border border-border rounded-lg p-4 space-y-1 shadow">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider flex items-center gap-1.5"><ImageIcon className="w-3 h-3 text-brand" /> Scraped Images</span>
                <p className="text-2xl font-black text-text-main font-mono">{stats.imagesCount}</p>
              </div>
              <div className="bg-bg-panel border border-border rounded-lg p-4 space-y-1 shadow">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider flex items-center gap-1.5"><UsersIcon className="w-3 h-3 text-brand" /> Active Users</span>
                <p className="text-2xl font-black text-brand font-mono">{stats.usersCount}</p>
              </div>
              <div className="bg-bg-panel border border-border rounded-lg p-4 space-y-1 shadow">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-brand" /> Successes</span>
                <p className="text-2xl font-black text-text-main font-mono">{stats.successCount}</p>
              </div>
              <div className="bg-bg-panel border border-border rounded-lg p-4 space-y-1 shadow">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider flex items-center gap-1.5"><AlertCircle className="w-3 h-3 text-brand" /> Failures</span>
                <p className="text-2xl font-black text-brand font-mono">{stats.failedCount}</p>
              </div>
            </div>
          </div>

          {/* SaaS Financial metrics */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">Financial Revenue metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* MRR Card */}
              <div className="bg-bg-panel border border-border rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-36 shadow-xl">
                <div className="absolute top-3 right-3 text-brand/20">
                  <DollarSign className="w-12 h-12" />
                </div>
                <div>
                  <span className="text-xs text-text-muted font-bold tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand" /> Monthly Recurring Revenue (MRR)
                  </span>
                  <p className="text-3xl font-black text-text-main mt-2 font-mono">${stats.mrr.toLocaleString()}</p>
                </div>
                <span className="text-[10px] text-text-muted">Calculated dynamically based on plan tiers.</span>
              </div>

              {/* ARR Card */}
              <div className="bg-bg-panel border border-border rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-36 shadow-xl">
                <div className="absolute top-3 right-3 text-text-muted/10">
                  <Landmark className="w-12 h-12" />
                </div>
                <div>
                  <span className="text-xs text-text-muted font-bold tracking-wider flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-brand" /> Estimated ARR (Annual Run Rate)
                  </span>
                  <p className="text-3xl font-black text-text-main mt-2 font-mono">${stats.arr.toLocaleString()}</p>
                </div>
                <span className="text-[10px] text-text-muted">Projected annual gross baseline.</span>
              </div>

              {/* ARPU Card */}
              <div className="bg-bg-panel border border-border rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-36 shadow-xl">
                <div className="absolute top-3 right-3 text-text-muted/10">
                  <CreditCard className="w-12 h-12" />
                </div>
                <div>
                  <span className="text-xs text-text-muted font-bold tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-brand" /> Average Revenue Per User (ARPU)
                  </span>
                  <p className="text-3xl font-black text-text-main mt-2 font-mono">${stats.arpu.toFixed(2)}</p>
                </div>
                <span className="text-[10px] text-text-muted">Average baseline subscription value.</span>
              </div>

            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => { setActiveTab("logs"); setFilterText(""); }}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "logs" 
                  ? "border-brand text-text-main" 
                  : "border-transparent text-text-muted hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4.5 h-4.5" /> Bulk Upload Logs
              </span>
            </button>
            <button
              onClick={() => { setActiveTab("users"); setFilterText(""); }}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "users" 
                  ? "border-brand text-text-main" 
                  : "border-transparent text-text-muted hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <UsersIcon className="w-4.5 h-4.5" /> Registered Accounts
              </span>
            </button>
          </div>

          {/* Logs table */}
          {activeTab === "logs" && (
            <div className="bg-bg-panel rounded-xl p-6 border border-border space-y-4 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <ImageIcon className="w-4.5 h-4.5 text-brand" /> All Processed Image Actions
                </h3>
                
                {/* Filters */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-grow md:w-64">
                    <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-3" />
                    <input 
                      type="text"
                      value={filterText}
                      onChange={e => setFilterText(e.target.value)}
                      className="w-full bg-bg border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-brand font-mono"
                      placeholder="Search by file or project..."
                    />
                  </div>
                  <select 
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-muted focus:outline-none focus:border-brand cursor-pointer"
                  >
                    <option value="all">All Logs</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-2.5 text-text-muted">
                  <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono">Fetching system audit logs...</span>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="py-16 text-center space-y-3 border border-dashed border-border rounded-xl bg-bg/50">
                  <ImageIcon className="w-10 h-10 text-text-muted mx-auto opacity-60" />
                  <p className="text-xs font-bold text-text-main">No audit logs match criteria</p>
                  <p className="text-[11px] text-text-muted max-w-[280px] mx-auto leading-relaxed">Process client batches inside projects or relax search filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-border rounded-xl bg-bg/30">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-bg-panel text-text-muted uppercase text-[10px] font-bold tracking-wider border-b border-border">
                      <tr>
                        <th className="p-3.5">File details</th>
                        <th className="p-3.5">Project / Client</th>
                        <th className="p-3.5">Injected GPS</th>
                        <th className="p-3.5">Timestamp</th>
                        <th className="p-3.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-bg-hover transition-colors">
                          <td className="p-3.5 max-w-[180px]">
                            <span className="font-extrabold block text-text-main truncate" title={log.originalFilename}>
                              {log.originalFilename}
                            </span>
                            <span className="text-[10px] text-text-muted block truncate font-mono" title={log.outputFilename}>
                              As: {log.outputFilename}
                            </span>
                            <span className="text-[9px] text-brand font-bold block pt-0.5 font-mono">
                              {(log.fileSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </td>
                          <td className="p-3.5">
                            <Link 
                              href={`/projects/${log.projectId}`}
                              className="font-bold text-white hover:text-brand hover:underline transition-colors block"
                            >
                              {log.projectName}
                            </Link>
                            {log.businessName && (
                              <span className="text-[9px] text-text-muted block">Client: {log.businessName}</span>
                            )}
                          </td>
                          <td className="p-3.5 font-mono text-[10px] text-text-muted">
                            <div>Lat: {log.latitude !== null && log.latitude !== undefined ? Number(log.latitude).toFixed(5) : "0.00000"}</div>
                            <div>Lng: {log.longitude !== null && log.longitude !== undefined ? Number(log.longitude).toFixed(5) : "0.00000"}</div>
                          </td>
                          <td className="p-3.5 text-text-muted text-[10px] font-mono">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="p-3.5 text-right">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                              log.status === "success" 
                                ? "bg-accent-green/10 text-accent-green border border-accent-green/20" 
                                : "bg-accent-mauve/10 text-accent-mauve border border-accent-mauve/20"
                            }`}>
                              {log.status === "success" ? (
                                <CheckCircle2 className="w-2.5 h-2.5" />
                              ) : (
                                <AlertCircle className="w-2.5 h-2.5" />
                              )}
                              {log.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Users registrations list */}
          {activeTab === "users" && (
            <div className="bg-bg-panel rounded-xl p-6 border border-border space-y-4 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                <h3 className="font-bold text-sm text-text-main flex items-center gap-2">
                  <UsersIcon className="w-4.5 h-4.5 text-brand" /> Registered Users database
                </h3>
                
                {/* Search */}
                <div className="relative w-full md:w-64">
                  <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-3" />
                  <input 
                    type="text"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-brand font-mono"
                    placeholder="Search by name or email..."
                  />
                </div>
              </div>

              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-2.5 text-text-muted">
                  <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono">Fetching system user records...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center space-y-2 border border-dashed border-border rounded-xl">
                  <UsersIcon className="w-8 h-8 text-text-muted mx-auto" />
                  <p className="text-xs font-bold text-text-main">No registered users match search</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-border rounded-xl bg-bg/30">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-bg-panel text-text-muted uppercase text-[10px] font-bold tracking-wider border-b border-border">
                      <tr>
                        <th className="p-3.5">User Details</th>
                        <th className="p-3.5">Email Address</th>
                        <th className="p-3.5">Account Plan</th>
                        <th className="p-3.5">Registered On</th>
                        <th className="p-3.5 text-right">System Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-bg-hover transition-colors">
                          <td className="p-3.5 font-bold text-white">
                            {user.name}
                          </td>
                          <td className="p-3.5 text-text-muted font-mono text-[10px]">
                            {user.email}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-brand/10 border border-brand/20 text-brand">
                              {user.plan}
                            </span>
                          </td>
                          <td className="p-3.5 text-text-muted text-[10px] font-mono">
                            {new Date(user.createdAt).toLocaleString()}
                          </td>
                          <td className="p-3.5 text-right">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                              user.role === "superadmin"
                                ? "bg-brand/10 text-brand border-brand/20"
                                : "bg-bg-panel text-text-muted border-border"
                            }`}>
                              {user.role.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

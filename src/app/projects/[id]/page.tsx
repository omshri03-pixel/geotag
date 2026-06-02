"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, MapPin, Tag, Download, Settings, Image as ImageIcon, 
  Map as LucideMap, Layers, FolderOpen, X, Info, LogOut, ChevronLeft, Calendar, 
  CheckCircle2, AlertTriangle, Play, Sparkles, Award, Star, ListFilter,
  BarChart3, RefreshCw, FileText, UploadCloud, Copy, Sparkle, Navigation
} from "lucide-react";
import UploadZone, { FileWithMeta } from "@/components/UploadZone";
import MapPicker from "@/components/MapPicker";
import * as ExifReader from "exifreader";

interface SavedLocation {
  name: string;
  lat: number;
  lng: number;
  city: string;
  businessName?: string;
  keywords?: string;
  altText?: string;
  renamePattern?: string;
  scatterEnabled?: boolean;
  scatterRadius?: number;
  outputFormat?: 'original' | 'webp' | 'avif';
}

export default function ProjectWorkspace() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [projectDetails, setProjectDetails] = useState({
    name: "Loading Project...",
    clientName: "",
    notes: ""
  });
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [seoData, setSeoData] = useState({
    businessName: "",
    keywords: "",
    altText: "{businessName} - {keyword}",
    renamePattern: "{businessName}-{keyword}-{number}"
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [auditOnly, setAuditOnly] = useState(false);
  
  // Custom SEO formats and Auto GPS Scatter states
  const [outputFormat, setOutputFormat] = useState<'original' | 'webp' | 'avif'>('original');
  const [scatterEnabled, setScatterEnabled] = useState(false);
  const [scatterRadius, setScatterRadius] = useState(15);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);

  // User profile states
  const [userName, setUserName] = useState("Marketer");
  const [userPlan, setUserPlan] = useState("Free");
  const [userEmail, setUserEmail] = useState("");
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [csvOverrideLoaded, setCsvOverrideLoaded] = useState(false);
  const [showReportBtn, setShowReportBtn] = useState(false);
  
  // Dynamic Audit results
  const [auditResults, setAuditResults] = useState<{
    overallScore: number;
    passedList: string[];
    issuesList: string[];
  } | null>(null);
  
  const [previewFile, setPreviewFile] = useState<FileWithMeta | null>(null);
  const [previewMetadata, setPreviewMetadata] = useState<any | null>(null);

  // AI Content Copilot States
  const [activeModalTab, setActiveModalTab] = useState<'audit' | 'ai' | 'edit'>('audit');
  const [aiContent, setAiContent] = useState<{
    gbpPost: string;
    instaCaption: string;
    suggestedKeywords: string[];
    isGenerating: boolean;
  } | null>(null);
  const [isOptimizingPack, setIsOptimizingPack] = useState(false);
  const [aiAutopilot, setAiAutopilot] = useState(false);

  // Local image-specific edit states inside modal
  const [editKeywords, setEditKeywords] = useState("");
  const [editBusiness, setEditBusiness] = useState("");
  const [editLat, setEditLat] = useState("");
  const [editLng, setEditLng] = useState("");

  // Saved Location Presets
  const [savedPresets, setSavedPresets] = useState<SavedLocation[]>([
    { name: "Dr Joy Dental Clinic - BurJuman", lat: 25.2532, lng: 55.3034, city: "Dubai" },
    { name: "Downtown Office Plaza - Marina", lat: 25.0772, lng: 55.1325, city: "Dubai" },
    { name: "Apex Dental Care - Jumeirah", lat: 25.2048, lng: 55.2708, city: "Dubai" }
  ]);

  // Fetch Project Details on Mount
  useEffect(() => {
    const token = localStorage.getItem("buzz_auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const localPresets = localStorage.getItem("buzz_saved_presets");
    if (localPresets) {
      try {
        setSavedPresets(JSON.parse(localPresets));
      } catch (e) {
        console.error("Failed to parse saved presets", e);
      }
    }

    setUserName(localStorage.getItem("buzz_user_name") || "Marketer");
    setUserPlan(localStorage.getItem("buzz_user_plan") || "Free");
    setUserEmail(localStorage.getItem("buzz_user_email") || "");

    if (!projectId) return;

    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) {
          throw new Error("Project not found");
        }
        const data = await res.json();
        if (data.project) {
          setProjectDetails({
            name: data.project.name,
            clientName: data.project.clientName || "",
            notes: data.project.notes || ""
          });
          
          // Load default templates from Workspace Settings if available
          const defaultBusiness = localStorage.getItem("buzz_default_business") || "";
          const defaultKeywords = localStorage.getItem("buzz_default_keywords") || "";
          const defaultRenamePattern = localStorage.getItem("buzz_rename_pattern") || "{businessName}-{keyword}-{number}";
          const defaultAltTextPattern = localStorage.getItem("buzz_alt_text_pattern") || "{businessName} - {keyword}";

          setSeoData({
            businessName: data.project.clientName || defaultBusiness || "",
            keywords: defaultKeywords,
            altText: defaultAltTextPattern,
            renamePattern: defaultRenamePattern
          });

          // Load presets dynamically from database
          const userId = localStorage.getItem("buzz_user_id") || "1";
          try {
            const presetsRes = await fetch(`/api/settings?userId=${userId}`);
            if (presetsRes.ok) {
              const presetsData = await presetsRes.json();
              if (presetsData.locations && presetsData.locations.length > 0) {
                setSavedPresets(presetsData.locations);
              }
            }
          } catch (presetsErr) {
            console.error("Error loading location presets:", presetsErr);
          }
        }
      } catch (err) {
        console.error("Error loading project:", err);
        alert("Failed to load project details. Redirecting to dashboard.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId, router]);

  // Compliance Scoring calculations
  const calculateFileScore = (f: FileWithMeta, meta: any) => {
    let score = 0;
    const passed: string[] = [];
    const issues: string[] = [];

    // 1. GPS Coordinates (25 pts)
    if (meta.lat && meta.lng) {
      score += 25;
      passed.push("EXIF GPS Coordinates Found");
    } else {
      issues.push("Missing GPS Coordinates mapping");
    }

    // 2. Suitable File Size (15 pts)
    const sizeInMB = parseFloat(meta.size) || 0.1;
    if (sizeInMB >= 0.01 && sizeInMB <= 5) {
      score += 15;
      passed.push("GBP Compliant File Size (10KB - 5MB)");
    } else {
      issues.push("File size exceeds GBP recommended 5MB limits");
    }

    // 3. Image Resolution (15 pts)
    const width = parseInt(meta.width) || 0;
    const height = parseInt(meta.height) || 0;
    if (width >= 720 && height >= 720) {
      score += 15;
      passed.push("Recommended Resolution (>= 720px)");
    } else if (width >= 250 && height >= 250) {
      score += 10;
      passed.push("Acceptable Resolution (>= 250px)");
      issues.push("Resolution below recommended 720px standard");
    } else {
      issues.push("Critically low resolution (below 250px standard)");
    }

    // 4. Filename Convention (15 pts)
    const nameLower = f.file.name.toLowerCase();
    const isGeneric = nameLower.startsWith("dsc") || nameLower.startsWith("img") || nameLower.startsWith("pxl") || nameLower.startsWith("photo") || nameLower.startsWith("image");
    if (!isGeneric) {
      score += 15;
      passed.push("Descriptive SEO-friendly Filename");
    } else {
      issues.push("Generic camera filename detected (e.g. DSC/IMG)");
    }

    // 5. Presets configured (30 pts)
    if (seoData.businessName && seoData.keywords) {
      score += 30;
      passed.push("SEO metadata pack & Copyright tags prefilled");
    } else {
      issues.push("SEO Title or target client values unconfigured");
    }

    return { score, passed, issues };
  };

  const handleSelectFileForPreview = async (f: FileWithMeta) => {
    setPreviewFile(f);
    setPreviewMetadata(null);
    setAiContent(null);
    setActiveModalTab('audit');
    
    setEditKeywords(f.customKeywords || "");
    setEditBusiness(f.customBusiness || "");
    setEditLat(f.customLat !== undefined ? f.customLat.toString() : "");
    setEditLng(f.customLng !== undefined ? f.customLng.toString() : "");
    
    try {
      const tags = await ExifReader.load(f.file);
      const meta = {
        name: f.file.name,
        size: (f.file.size / 1024 / 1024).toFixed(2) + " MB",
        width: tags["Image Width"]?.description || "720",
        height: tags["Image Height"]?.description || "720",
        make: tags["Make"]?.description || "Unknown",
        model: tags["Model"]?.description || "Unknown",
        date: tags["DateTimeOriginal"]?.description || tags["DateTime"]?.description || "Unknown",
        lat: tags["GPSLatitude"]?.description || null,
        lng: tags["GPSLongitude"]?.description || null,
      };
      
      const { score, passed, issues } = calculateFileScore(f, meta);
      setPreviewMetadata({
        ...meta,
        score,
        passed,
        issues
      });
    } catch (err) {
      console.error("Error reading preview metadata", err);
      const meta = {
        name: f.file.name,
        size: (f.file.size / 1024 / 1024).toFixed(2) + " MB",
        width: "720",
        height: "720",
        make: "Unknown",
        model: "Unknown",
        date: "Unknown",
        lat: null,
        lng: null,
      };
      const { score, passed, issues } = calculateFileScore(f, meta);
      setPreviewMetadata({
        ...meta,
        score,
        passed,
        issues
      });
    }
  };

  const handleSaveCustomMetadata = () => {
    if (!previewFile) return;
    
    setFiles(prev => prev.map(f => {
      if (f.id === previewFile.id) {
        return {
          ...f,
          customKeywords: editKeywords || undefined,
          customBusiness: editBusiness || undefined,
          customLat: editLat ? parseFloat(editLat) : undefined,
          customLng: editLng ? parseFloat(editLng) : undefined
        };
      }
      return f;
    }));

    // Trigger compliance score recalculation
    const updatedMeta = {
      ...previewMetadata,
      lat: editLat ? editLat : previewMetadata?.lat,
      lng: editLng ? editLng : previewMetadata?.lng,
    };
    
    const dummyFileWithMeta = {
      ...previewFile,
      customKeywords: editKeywords || undefined,
      customBusiness: editBusiness || undefined,
      customLat: editLat ? parseFloat(editLat) : undefined,
      customLng: editLng ? parseFloat(editLng) : undefined
    };

    const { score, passed, issues } = calculateFileScore(dummyFileWithMeta, updatedMeta);
    setPreviewMetadata({
      ...updatedMeta,
      score,
      passed,
      issues
    });

    alert("Custom metadata tweaks saved successfully for this asset!");
    setActiveModalTab('audit');
  };

  const handleAiOptimizePack = async () => {
    if (!seoData.businessName) {
      alert("Please enter a Business Name first so the AI knows what to optimize for!");
      return;
    }

    setIsOptimizingPack(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          data: {
            message: `You are an elite Google Business Profile & local SEO metadata optimization engine.
Analyze this local business:
Business Name: "${seoData.businessName}"
Project Notes/Context: "${projectDetails.notes || 'Bulk local optimization'}"

Generate the following three properties strictly formatted as a valid JSON object:
1. "keywords": A comma-separated list of exactly 5 highly optimized, high-intent local search keywords for this business type. No punctuation other than commas between keywords.
2. "altText": A target ALT text template pattern (e.g. "{businessName} - {keyword}"). Make it highly professional and relevant.
3. "renamePattern": An optimized file naming pattern (e.g. "{businessName}-{keyword}-{number}").

Format: Return ONLY the raw JSON object, no explanation. Example:
{"keywords": "dentist in mumbai, best dental clinic", "altText": "{businessName} {keyword}", "renamePattern": "{businessName}-{keyword}-{number}"}`
          }
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        // Try parsing JSON response from AI
        const jsonMatch = data.data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setSeoData(prev => ({
            ...prev,
            keywords: parsed.keywords || prev.keywords,
            altText: parsed.altText || prev.altText,
            renamePattern: parsed.renamePattern || prev.renamePattern
          }));
          alert("🪄 Magic! Your SEO Metadata Pack has been fully optimized by Llama 3.3 AI!");
        } else {
          throw new Error("AI output formatting failed.");
        }
      } else {
        throw new Error(data.error || "Failed to contact AI.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Could not autocomplete pack. Try entering keywords manually.");
    } finally {
      setIsOptimizingPack(false);
    }
  };

  const generateAiContent = async () => {
    if (!seoData.businessName || !seoData.keywords) {
      alert("Please configure Business Name and Keywords in the SEO Metadata Pack first to activate the AI Content Copilot.");
      return;
    }

    setAiContent({
      gbpPost: "",
      instaCaption: "",
      suggestedKeywords: [],
      isGenerating: true
    });

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_copilot",
          data: {
            businessName: seoData.businessName,
            keywords: seoData.keywords,
            filename: previewFile?.file?.name || "local-seo-image.jpg"
          }
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const { gbpPost, instaCaption, suggestedKeywords } = data.data;
        setAiContent({
          gbpPost: gbpPost || "",
          instaCaption: instaCaption || "",
          suggestedKeywords: Array.isArray(suggestedKeywords) ? suggestedKeywords : [],
          isGenerating: false
        });
      } else {
        throw new Error(data.error || "Failed to generate AI contents");
      }
    } catch (err: any) {
      console.error("AI Copilot Error:", err);
      // Fallback in case of rate limit or error
      const bizName = seoData.businessName;
      const keyList = seoData.keywords.split(",").map(k => k.trim());
      const primaryKey = keyList[0] || "professional service";
      const secondaryKey = keyList[1] || "best local services";
      const hashtags = keyList.map(k => `#${k.replace(/\s+/g, "")}`).slice(0, 4).join(" ");

      setAiContent({
        gbpPost: `📍 Update from ${bizName}! \n\nLooking for top-rated ${primaryKey} in town? At ${bizName}, we specialize in high-quality, professional solutions. \n\n📞 Call or contact us today to book an appointment! \n\n${hashtags}`,
        instaCaption: `🌟 Discover ${bizName}! 🌟\n\nWhen it comes to professional ${primaryKey} and expert ${secondaryKey}, our team has you covered.\n\n💬 DM us to learn more!\n\n#SupportLocal ${hashtags}`,
        suggestedKeywords: [`${primaryKey} near me`, `best ${primaryKey} in city`],
        isGenerating: false
      });
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        alert("CSV file seems to be empty or missing headers.");
        return;
      }

      const headers = lines[0].toLowerCase().split(",").map(h => h.trim());
      const fileIndex = headers.indexOf("filename");
      const latIndex = headers.indexOf("latitude");
      const lngIndex = headers.indexOf("longitude");
      const bizIndex = headers.indexOf("business_name") !== -1 ? headers.indexOf("business_name") : headers.indexOf("business");
      const keysIndex = headers.indexOf("keywords");

      if (fileIndex === -1 || latIndex === -1 || lngIndex === -1) {
        alert("CSV must contain 'filename', 'latitude', and 'longitude' headers!");
        return;
      }

      let matchCount = 0;
      const csvDataMap = new Map<string, any>();

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.trim());
        if (cols.length < Math.max(fileIndex, latIndex, lngIndex) + 1) continue;

        const filename = cols[fileIndex];
        const lat = parseFloat(cols[latIndex]);
        const lng = parseFloat(cols[lngIndex]);
        const business = bizIndex !== -1 ? cols[bizIndex] : "";
        const keywords = keysIndex !== -1 ? cols[keysIndex] : "";

        if (filename && !isNaN(lat) && !isNaN(lng)) {
          csvDataMap.set(filename.toLowerCase(), { lat, lng, business, keywords });
        }
      }

      setFiles(prev => prev.map(f => {
        const match = csvDataMap.get(f.file.name.toLowerCase());
        if (match) {
          matchCount++;
          return {
            ...f,
            customLat: match.lat,
            customLng: match.lng,
            customBusiness: match.business,
            customKeywords: match.keywords,
            customAlt: match.business && match.keywords ? `${match.business} - ${match.keywords}` : ""
          };
        }
        return f;
      }));

      if (matchCount > 0) {
        setCsvOverrideLoaded(true);
        alert(`Success! Matched CSV coordinates overrides for ${matchCount} files in your queue.`);
      } else {
        alert("No files in the upload queue matched any filenames in the CSV.");
      }
    };
    reader.readAsText(file);
  };

  const handleScrapeWebsiteImages = async () => {
    if (!scrapeUrl) {
      alert("Please input a valid website URL first!");
      return;
    }
    
    setIsScraping(true);
    try {
      const res = await fetch(`/api/scrape?url=${encodeURIComponent(scrapeUrl)}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      
      if (!data.images || data.images.length === 0) {
        alert("No public images extracted from this URL. Please verify the URL or try another page.");
        setIsScraping(false);
        return;
      }
      
      alert(`Scraped ${data.images.length} image URLs successfully! Now proxy-downloading them into your Workspace queue...`);
      
      let successCount = 0;
      for (let i = 0; i < data.images.length; i++) {
        const imgUrl = data.images[i];
        try {
          const proxyRes = await fetch(`/api/proxy?url=${encodeURIComponent(imgUrl)}`);
          if (!proxyRes.ok) continue;
          
          const blob = await proxyRes.blob();
          const ext = imgUrl.split('.').pop()?.split('?')[0] || 'jpg';
          const filename = `scraped-asset-${i+1}.${ext}`;
          const fileObj = new File([blob], filename, { type: blob.type });
          
          const newFile: FileWithMeta = {
            file: fileObj,
            id: `scraped-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
            hasGPS: false,
            status: 'pending'
          };
          
          setFiles(prev => [...prev, newFile]);
          successCount++;
        } catch (err) {
          console.error("Failed to proxy-download image", imgUrl, err);
        }
      }
      
      alert(`Successfully loaded ${successCount} assets into your project workspace!`);
      setScrapeUrl("");
    } catch (err: any) {
      console.error(err);
      alert("Error occurred while scraping website images: " + err.message);
    } finally {
      setIsScraping(false);
    }
  };

  const handleSaveCurrentAsPreset = () => {
    const name = window.prompt("Enter a friendly name for this Saved Business Profile Preset:", seoData.businessName || "My Saved Business Profile");
    if (!name) return;

    const newPreset: SavedLocation = {
      name,
      lat: location ? location.lat : 25.2532,
      lng: location ? location.lng : 55.3034,
      city: "Custom Preset",
      businessName: seoData.businessName,
      keywords: seoData.keywords,
      altText: seoData.altText,
      renamePattern: seoData.renamePattern,
      scatterEnabled,
      scatterRadius,
      outputFormat
    };

    const updated = [...savedPresets, newPreset];
    setSavedPresets(updated);
    localStorage.setItem("buzz_saved_presets", JSON.stringify(updated));
    alert(`Business profile preset "${name}" has been permanently saved!`);
  };

  const downloadOptimizationReport = () => {
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>LocalLens AI - Metadata Optimization Report</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0c0c0c; color: #e2e8f0; padding: 40px; margin: 0; }
          .container { max-width: 900px; margin: 0 auto; background: #161616; padding: 40px; border-radius: 16px; border: 1px solid #2d2d2d; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { border-bottom: 2px solid #2d2d2d; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
          .header p { color: #f59e0b; font-weight: bold; margin: 5px 0 0 0; }
          .badge { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
          .stat-card { background: #1f1f1f; padding: 20px; border-radius: 10px; border: 1px solid #2d2d2d; text-align: center; }
          .stat-card span { font-size: 11px; text-transform: uppercase; color: #a3a3a3; letter-spacing: 1px; }
          .stat-card h3 { font-size: 24px; margin: 10px 0 0 0; color: #ffffff; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #1f1f1f; text-align: left; padding: 12px; border-bottom: 2px solid #2d2d2d; font-size: 13px; color: #f59e0b; }
          td { padding: 12px; border-bottom: 1px solid #2d2d2d; font-size: 12px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #2d2d2d; text-align: center; font-size: 11px; color: #737373; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>Local SEO Optimization Report</h1>
              <p>Client: ${seoData.businessName || projectDetails.clientName || "Enterprise Partner"}</p>
            </div>
            <div class="badge">PREPARED BY LOCALLENS AI</div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <span>Project Name</span>
              <h3>${projectDetails.name}</h3>
            </div>
            <div class="stat-card">
              <span>Optimized Files</span>
              <h3>${files.length}</h3>
            </div>
            <div class="stat-card">
              <span>Date Generated</span>
              <h3>${new Date().toLocaleDateString()}</h3>
            </div>
          </div>

          <h2>Optimized Assets Inventory</h2>
          <table>
            <thead>
              <tr>
                <th>Original File</th>
                <th>Target Coordinates</th>
                <th>Focus Keywords</th>
                <th>Metadata Status</th>
              </tr>
            </thead>
            <tbody>
              ${files.map(f => `
                <tr>
                  <td><strong>${f.file.name}</strong></td>
                  <td><code>${(f.customLat !== undefined && f.customLng !== undefined) ? `${f.customLat.toFixed(5)}, ${f.customLng.toFixed(5)} (CSV)` : location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : "Embedded GPS"}</code></td>
                  <td>${f.customKeywords || seoData.keywords || "local SEO"}</td>
                  <td style="color: #10b981; font-weight: bold;">✓ IPTC + GPS Injected</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>LocalLens AI Enterprise Suite - 100% Verified Local SEO Metadata Reports</p>
            <p>© ${new Date().getFullYear()} LocalLens AI Corporate. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectDetails.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-seo-report.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const runAuditDiagnostics = async () => {
    if (files.length === 0) {
      alert("Please upload images first to run audit diagnostics.");
      return;
    }
    
    setIsProcessing(true);
    let totalScore = 0;
    const globalIssues = new Set<string>();
    const globalPassed = new Set<string>();

    for (let f of files) {
      let lat = null, lng = null, width = "720", height = "720", size = "0.2 MB";
      try {
        const tags = await ExifReader.load(f.file);
        lat = tags["GPSLatitude"]?.description || null;
        lng = tags["GPSLongitude"]?.description || null;
        width = tags["Image Width"]?.description || "720";
        height = tags["Image Height"]?.description || "720";
        size = (f.file.size / 1024 / 1024).toFixed(2) + " MB";
      } catch (err) {}

      const { score, passed, issues } = calculateFileScore(f, { lat, lng, width, height, size });
      totalScore += score;
      passed.forEach(p => globalPassed.add(p));
      issues.forEach(i => globalIssues.add(i));
    }

    setTimeout(() => {
      const avgScore = Math.round(totalScore / files.length);
      setAuditResults({
        overallScore: avgScore,
        passedList: Array.from(globalPassed),
        issuesList: Array.from(globalIssues)
      });
      setShowAuditModal(true);
      setIsProcessing(false);
    }, 800);
  };

  const handleProcess = async (overrideAuditOnly?: boolean) => {
    const isAudit = overrideAuditOnly !== undefined ? overrideAuditOnly : auditOnly;
    if (isAudit) {
      runAuditDiagnostics();
      return;
    }

    const pendingFiles = files.filter(f => f.status !== 'success');
    if (pendingFiles.length === 0) {
      alert("No pending files in the queue to process!");
      return;
    }
    
    if (!location && !csvOverrideLoaded) {
      alert("Please select a target location on the map or import a CSV geotag override file first to apply auto-fix injections!");
      return;
    }
    
    const hasExistingGPS = pendingFiles.some(f => f.hasGPS);
    if (hasExistingGPS) {
      const confirmReplace = window.confirm("Some uploaded images already contain GPS metadata. Do you want to replace them with the selected location?");
      if (!confirmReplace) return;
    }
    
    setIsProcessing(true);
    setFiles(prev => prev.map(f => f.status === 'success' ? f : { ...f, status: 'processing' }));
    
    try {
      const formData = new FormData();
      formData.append("lat", location ? location.lat.toString() : "0");
      formData.append("lng", location ? location.lng.toString() : "0");
      formData.append("businessName", seoData.businessName);
      formData.append("keywords", seoData.keywords);
      formData.append("altText", seoData.altText);
      formData.append("renamePattern", seoData.renamePattern);
      formData.append("projectId", projectId);
      
      formData.append("scatterEnabled", scatterEnabled ? "true" : "false");
      formData.append("scatterRadius", scatterRadius.toString());
      formData.append("outputFormat", outputFormat);
      formData.append("aiAutopilot", aiAutopilot ? "true" : "false");
      
      pendingFiles.forEach((f, idx) => {
        formData.append("files", f.file);
        if (f.customLat !== undefined) {
          formData.append(`lat_${idx}`, f.customLat.toString());
        }
        if (f.customLng !== undefined) {
          formData.append(`lng_${idx}`, f.customLng.toString());
        }
        if (f.customBusiness !== undefined) {
          formData.append(`business_${idx}`, f.customBusiness);
        }
        if (f.customKeywords !== undefined) {
          formData.append(`keywords_${idx}`, f.customKeywords);
        }
      });

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectDetails.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-optimized.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      setFiles(prev => prev.map(f => f.status === 'processing' ? { ...f, status: 'success' } : f));
      setShowReportBtn(true);
      alert("Success! Optimized geo-tagged images have been downloaded.");
    } catch (error: any) {
      console.error(error);
      setFiles(prev => prev.map(f => f.status === 'processing' ? { ...f, status: 'failed', errorMessage: error.message || "Failed" } : f));
      alert("Failed to process batch. See file list for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text-main flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-muted font-sans">Loading workspace context...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text-main flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass border-r border-border p-6 flex flex-col gap-8 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-[#FF8533] flex items-center justify-center shadow-lg shadow-brand/20 transition-transform hover:rotate-45 duration-300 shrink-0">
            <Navigation className="text-black w-4.5 h-4.5 font-bold" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#FFFFFF]">LocalLens AI</span>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-text-muted hover:text-white hover:bg-bg-hover">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-black transition-colors bg-bg-panel text-brand">
            <FolderOpen className="w-4 h-4 text-brand" />
            Workspace
          </div>
          
          {showReportBtn && (
            <button
              onClick={downloadOptimizationReport}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-black transition-all bg-accent-green/10 border border-accent-green/30 text-accent-green hover:bg-accent-green/20 text-left mt-4 cursor-pointer w-full"
            >
              <FileText className="w-4 h-4 text-accent-green" />
              Download SEO Report
            </button>
          )}
        </nav>
        
        <div className="mt-auto pt-4 border-t border-border/50 space-y-3">
          <div className="glass bg-bg-panel/40 p-3 rounded-xl border border-border/60 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand flex items-center justify-center font-bold text-xs text-brand uppercase">
                {userName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-xs text-text-main truncate">{userName}</p>
                <p className="text-[10px] text-text-muted truncate">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-border/30">
              <span className="px-2 py-0.5 rounded bg-brand/10 border border-brand/20 text-[9px] font-extrabold text-brand tracking-wider">
                {userPlan.toUpperCase()}
              </span>
              <button
                onClick={() => {
                  localStorage.clear();
                  router.push("/login");
                }}
                className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                title="Log Out Session"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1 font-mono uppercase tracking-wider">
                <FolderOpen className="w-3 h-3 text-brand" /> Project Workspace / #{projectId}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main">{projectDetails.name}</h2>
              {projectDetails.clientName && (
                <p className="text-xs text-brand font-medium mt-1">Client: {projectDetails.clientName}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              {showReportBtn && (
                <button
                  onClick={downloadOptimizationReport}
                  className="bg-accent-green hover:bg-accent-green/80 text-[#000000] text-xs font-black px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#000000]" /> Download Client Report
                </button>
              )}
              <Link 
                href="/dashboard" 
                className="bg-bg-panel hover:bg-bg-hover border border-border text-xs font-bold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 self-start cursor-pointer text-text-main"
              >
                <ChevronLeft className="w-4 h-4" /> Dashboard
              </Link>
            </div>
          </header>

          {/* Project notes if available */}
          {projectDetails.notes && (
            <div className="bg-bg-panel/40 border border-border rounded-xl p-4 text-xs text-text-muted">
              <span className="font-semibold text-text-main block mb-1">Project Notes</span>
              <p className="leading-relaxed">{projectDetails.notes}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Upload & List */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Compliance Image Upload Card */}
              <div className="glass rounded-xl p-6 border border-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                  <h3 className="font-semibold flex items-center gap-2 text-sm text-text-main">
                    <ImageIcon className="w-5 h-5 text-brand" /> 
                    1. GBP Images Upload
                  </h3>
                  
                  {/* CSV Bulk Upload Button Hook */}
                  <div className="flex items-center gap-2">
                    <label className="bg-bg-panel hover:bg-bg-hover border border-border text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-white">
                      <UploadCloud className="w-3.5 h-3.5 text-brand" /> Import Bulk CSV Geotags
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        className="hidden"
                      />
                    </label>
                    
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-bg-panel text-text-muted border border-border">
                      {files.length} selected
                    </span>
                  </div>
                </div>

                {csvOverrideLoaded && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-2.5 rounded-lg text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> CSV Geotags overrides loaded for matched assets!
                  </div>
                )}

                {/* 🌐 Web Scrape URL Extract Container */}
                <div className="bg-bg-panel/40 border border-border/60 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      🌐 Batch Extract Images from Website URL
                    </span>
                    <span className="px-2 py-0.5 text-[8px] font-extrabold text-brand bg-brand/10 border border-brand/20 rounded uppercase tracking-wider">
                      PRO Feature
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={scrapeUrl}
                      onChange={e => setScrapeUrl(e.target.value)}
                      className="flex-1 bg-bg border border-border rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-brand"
                      placeholder="e.g. https://www.rohandental.com/gallery"
                    />
                    <button
                      type="button"
                      disabled={isScraping}
                      onClick={handleScrapeWebsiteImages}
                      className="bg-brand hover:bg-brand-hover text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap shadow-sm shadow-brand/10"
                    >
                      {isScraping ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Extracting...
                        </>
                      ) : (
                        "Extract Images"
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-text-muted">
                    Input a website link to instantly scan, scrape and proxy its images into your active local SEO project queue.
                  </p>
                </div>

                <UploadZone files={files} setFiles={setFiles} onSelectFile={handleSelectFileForPreview} />
              </div>
              
              {/* Mappicker & Saved Presets Location Card */}
              <div className="glass rounded-xl p-6 border border-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-semibold flex items-center gap-2 text-sm text-text-main">
                    <LucideMap className="w-5 h-5 text-brand" /> 
                    2. Location Presets & Map
                  </h3>
                  
                  {/* Preset Locations Dropdown */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Star className="w-3.5 h-3.5 text-brand fill-brand" />
                    <select
                      onChange={(e) => {
                        const idx = parseInt(e.target.value);
                        if (!isNaN(idx)) {
                          const item = savedPresets[idx];
                          setLocation({ lat: item.lat, lng: item.lng });
                          
                          if (item.businessName !== undefined) {
                            setSeoData({
                              businessName: item.businessName || "",
                              keywords: item.keywords || "",
                              altText: item.altText || "{businessName} - {keyword}",
                              renamePattern: item.renamePattern || "{businessName}-{keyword}-{number}"
                            });
                          }
                          if (item.scatterEnabled !== undefined) {
                            setScatterEnabled(item.scatterEnabled);
                          }
                          if (item.scatterRadius !== undefined) {
                            setScatterRadius(item.scatterRadius);
                          }
                          if (item.outputFormat !== undefined) {
                            setOutputFormat(item.outputFormat);
                          }
                        }
                      }}
                      className="bg-bg border border-border rounded-lg px-2 py-1 text-xs text-text-muted focus:outline-none focus:border-brand cursor-pointer"
                    >
                      <option value="">Quick Select Preset Location...</option>
                      {savedPresets.map((item, idx) => (
                        <option key={idx} value={idx}>{item.name}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleSaveCurrentAsPreset}
                      className="bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold px-2 py-1 rounded hover:bg-brand/20 transition-all cursor-pointer flex items-center gap-1.5"
                      title="Save current config and pin as new Preset"
                    >
                      <Star className="w-3 h-3 text-brand fill-brand/20" /> Save Current Preset
                    </button>
                  </div>
                </div>

                <MapPicker location={location} setLocation={setLocation} />
              </div>
            </div>

            {/* Column 2: SEO & Action Panels */}
            <div className="space-y-6">
              
              {/* SEO Pack Inputs Card */}
              <div className="glass rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
                  <h3 className="font-semibold flex items-center gap-2 text-sm text-text-main">
                    <Tag className="w-5 h-5 text-brand" /> 
                    3. SEO Metadata Pack
                  </h3>
                  <button
                    type="button"
                    onClick={handleAiOptimizePack}
                    disabled={isOptimizingPack}
                    className="bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-brand/20 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isOptimizingPack ? (
                      <>
                        <div className="w-3 h-3 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-brand" />
                        AI Autocomplete
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Business Name</label>
                    <input 
                      type="text" 
                      value={seoData.businessName}
                      onChange={e => setSeoData({...seoData, businessName: e.target.value})}
                      className="w-full bg-bg-panel border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand transition-colors text-text-main"
                      placeholder="e.g. Acme Dental Clinic"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Target Keywords (Comma separated)</label>
                    <input 
                      type="text"
                      value={seoData.keywords}
                      onChange={e => setSeoData({...seoData, keywords: e.target.value})}
                      className="w-full bg-bg-panel border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand transition-colors text-text-main"
                      placeholder="dentist near me, teeth whitening"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Auto ALT Text Pattern</label>
                    <input 
                      type="text"
                      value={seoData.altText}
                      onChange={e => setSeoData({...seoData, altText: e.target.value})}
                      className="w-full bg-bg-panel border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand transition-colors text-text-main font-mono text-[10px]"
                      placeholder="{businessName} - {keyword}"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">File Rename Pattern</label>
                    <input 
                      type="text"
                      value={seoData.renamePattern}
                      onChange={e => setSeoData({...seoData, renamePattern: e.target.value})}
                      className="w-full bg-bg-panel border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand transition-colors text-text-main font-mono text-[10px]"
                      placeholder="{businessName}-{keyword}-{number}"
                    />
                  </div>
                </div>
              </div>

              {/* Next-Gen SEO Optimizations Card */}
              <div className="glass rounded-xl p-6 border border-border space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-sm text-text-main">
                  <Sparkles className="w-5 h-5 text-brand" /> 
                  4. Advanced Optimizations
                </h3>
                
                <div className="space-y-4">
                  {/* Format selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-text-muted">Target Output Format</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['original', 'webp', 'avif'] as const).map((format) => (
                        <button
                          key={format}
                          type="button"
                          onClick={() => setOutputFormat(format)}
                          className={`py-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            outputFormat === format 
                              ? "bg-brand/20 border-brand text-brand" 
                              : "bg-bg-panel/40 border-border/80 text-text-muted hover:text-white"
                          }`}
                        >
                          {format === 'original' ? 'Original' : format === 'webp' ? 'WebP' : 'AVIF'}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-text-muted leading-relaxed">
                      Convert heavy JPG/PNG assets to WebP/AVIF formats to boost PageSpeed scores without losing quality or geotags.
                    </p>
                  </div>

                  {/* Scatter controls */}
                  <div className="border-t border-border/50 pt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Auto GPS Dispersal</span>
                        <span className="text-[10px] text-text-muted mt-0.5 block">Scatter coordinates around business radius</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setScatterEnabled(!scatterEnabled)}
                        className={`w-10 h-5.5 rounded-full transition-colors flex items-center p-0.5 ${
                          scatterEnabled ? "bg-brand" : "bg-bg-panel border border-border"
                        } cursor-pointer`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                          scatterEnabled ? "translate-x-4.5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {scatterEnabled && (
                      <div className="space-y-1.5 bg-bg/40 p-3 rounded-lg border border-border/80">
                        <div className="flex items-center justify-between text-[11px] font-bold text-text-muted">
                          <span>Scatter Radius</span>
                          <span className="text-brand">{scatterRadius} meters</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          step="5"
                          value={scatterRadius}
                          onChange={e => setScatterRadius(parseInt(e.target.value))}
                          className="w-full accent-brand bg-bg-panel h-1 rounded-lg cursor-pointer appearance-none"
                        />
                        <p className="text-[9px] text-text-muted">
                          Slightly scatters GPS tags (5m to 100m) to simulate organic natural uploads and bypass local footprint penalties.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AI SEO Autopilot Toggle */}
                  <div className="border-t border-border/50 pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand" />
                        AI SEO Autopilot
                        <span className="px-1.5 py-0.5 text-[7px] font-black text-brand bg-brand/10 border border-brand/20 rounded uppercase tracking-wider">Llama 3.3</span>
                      </span>
                      <span className="text-[10px] text-text-muted mt-0.5 block leading-normal">Fully generate 100% unique ALT tags and rename files using AI on the fly</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setAiAutopilot(!aiAutopilot)}
                      className={`w-10 h-5.5 rounded-full transition-colors flex items-center p-0.5 ${
                        aiAutopilot ? "bg-brand" : "bg-bg-panel border border-border"
                      } cursor-pointer`}
                    >
                      <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                        aiAutopilot ? "translate-x-4.5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Toggle Audit Only Mode */}
              <div className="glass rounded-xl p-6 border border-border space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div>
                    <span className="text-xs font-bold text-white block">Audit Mode Only</span>
                    <span className="text-[10px] text-text-muted mt-0.5 block">Audit and score without tagging files</span>
                  </div>
                  
                  {/* Slider Toggle */}
                  <button
                    onClick={() => setAuditOnly(!auditOnly)}
                    className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                      auditOnly ? "bg-brand" : "bg-bg-panel border border-border"
                    } cursor-pointer`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      auditOnly ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <h3 className="font-semibold flex items-center gap-2 text-sm text-text-main">
                  <Settings className="w-5 h-5 text-brand" /> 
                  4. Process Workspace
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {auditOnly 
                    ? "Generate a complete local SEO audit score report for your image library." 
                    : `Inject GPS coordinates, SEO ALT metadata, and renaming templates into ${files.length} images.`}
                </p>
                <button 
                  onClick={() => handleProcess()}
                  disabled={files.length === 0 || (!location && !auditOnly && !csvOverrideLoaded) || isProcessing}
                  className="w-full bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:hover:bg-brand text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md shadow-brand/10"
                >
                  {isProcessing ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : auditOnly ? (
                    <>
                      <Sparkles className="w-4 h-4" /> Run SEO Audit & Report
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Generate optimized ZIP
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Before / After comparative Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-bg-panel border border-border/80 w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col gap-4 text-text-main"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand" />
                  <h3 className="font-bold text-base truncate max-w-[320px] text-white" title={previewFile.file.name}>
                    GeoTagger Assistant: {previewFile.file.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 hover:bg-bg rounded-md text-text-muted hover:text-text-main transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Tabs Header */}
              <div className="flex gap-2 border-b border-border/60 pb-2">
                <button
                  onClick={() => setActiveModalTab('audit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeModalTab === 'audit' 
                      ? "bg-brand text-white shadow-md shadow-brand/10" 
                      : "bg-bg hover:bg-bg-hover text-text-muted hover:text-white"
                  }`}
                >
                  📊 Compliance & Comparatives
                </button>
                <button
                  onClick={() => setActiveModalTab('ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeModalTab === 'ai' 
                      ? "bg-brand text-white shadow-md shadow-brand/10" 
                      : "bg-bg hover:bg-bg-hover text-text-muted hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand animate-pulse" /> AI Content Copilot
                </button>
                <button
                  onClick={() => setActiveModalTab('edit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeModalTab === 'edit' 
                      ? "bg-brand text-white shadow-md shadow-brand/10" 
                      : "bg-bg hover:bg-bg-hover text-text-muted hover:text-white"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-brand" /> Custom Tweaks
                </button>
              </div>

              {activeModalTab === 'audit' ? (
                previewMetadata ? (
                  <div className="space-y-4">
                    
                    {/* Dynamic Score gauge card */}
                    <div className="bg-bg-panel/80 p-4 rounded-xl border border-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider">GBP Local Optimization Score</span>
                        <p className="text-sm text-white mt-1">Image Score: <span className={`font-extrabold text-lg ${
                          previewMetadata.score >= 80 ? "text-green-400" : previewMetadata.score >= 50 ? "text-yellow-400" : "text-red-400"
                        }`}>{previewMetadata.score} / 100</span></p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider ${
                        previewMetadata.score >= 80 ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}>
                        {previewMetadata.score >= 80 ? "GBP READY" : "WARNINGS PENDING"}
                      </span>
                    </div>

                    {/* Side by Side Comparative metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Before parameters */}
                      <div className="bg-bg/40 p-4 rounded-xl border border-border/80 space-y-3">
                        <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> 1. BEFORE EXIF (Original)
                        </h4>
                        <div className="text-xs space-y-2 text-text-muted">
                          <div>
                            <span className="block text-[9px] text-text-muted">GPS Coordinates</span>
                            <span className="font-semibold text-white">{previewMetadata.lat ? `${Number(previewMetadata.lat).toFixed(5)}, ${Number(previewMetadata.lng).toFixed(5)}` : <span className="text-red-400 font-bold">NOT DETECTED</span>}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-text-muted">Alt Text Description</span>
                            <span className="font-semibold text-white"><span className="text-red-400 font-bold">MISSING EXIF/IPTC</span></span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-text-muted">Copyright Details</span>
                            <span className="font-semibold text-white"><span className="text-red-400 font-bold">UNREGISTERED</span></span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-text-muted">Image Filename</span>
                            <span className="font-semibold text-white truncate block max-w-[240px] font-mono text-[10px]">{previewFile.file.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* After parameters */}
                      <div className="bg-gradient-to-br from-brand/10 to-bg-panel p-4 rounded-xl border border-brand/20 space-y-3">
                        <h4 className="text-[10px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 2. AFTER EXIF (Optimized)
                        </h4>
                        <div className="text-xs space-y-2 text-text-muted">
                          <div>
                            <span className="block text-[9px] text-text-muted font-mono text-brand/80">GPS Coordinates</span>
                            <span className="font-semibold text-white">
                              {previewFile.customLat !== undefined 
                                ? `${previewFile.customLat.toFixed(5)}, ${previewFile.customLng?.toFixed(5)} (CSV Override)`
                                : location 
                                  ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` 
                                  : <span className="text-yellow-500 font-bold">SELECT MAP PIN</span>}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-text-muted font-mono text-brand/80">Alt Text Description</span>
                            <span className="font-semibold text-white truncate block max-w-[240px]" title={seoData.altText}>
                              {seoData.altText.replace(/{businessName}/g, previewFile.customBusiness || seoData.businessName).replace(/{keyword}/g, previewFile.customKeywords?.split(",")[0]?.trim() || seoData.keywords.split(",")[0]?.trim() || "local")}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-text-muted font-mono text-brand/80">Copyright Ownership</span>
                            <span className="font-semibold text-white truncate block max-w-[240px]">Copyright © {new Date().getFullYear()} {previewFile.customBusiness || seoData.businessName || "Agency Client"}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-text-muted font-mono text-brand/80">Image Filename</span>
                            <span className="font-semibold text-white truncate block max-w-[240px] font-mono text-[10px]">
                              {seoData.renamePattern
                                .replace(/{businessName}/g, previewFile.customBusiness || seoData.businessName)
                                .replace(/{keyword}/g, previewFile.customKeywords?.split(",")[0]?.trim() || seoData.keywords.split(",")[0]?.trim() || "local")
                                .replace(/{number}/g, "01")
                                .toLowerCase()
                                .replace(/[^a-z0-9-]+/g, "-") + previewFile.file.name.substring(previewFile.file.name.lastIndexOf("."))}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Diagnostic logs */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider block">Compliance Audit Checklist</span>
                      <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                        {previewMetadata.passed.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[10px] text-green-400 bg-green-500/5 px-2.5 py-1 rounded border border-green-500/10">
                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> {item}
                          </div>
                        ))}
                        {previewMetadata.issues.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[10px] text-yellow-400 bg-yellow-500/5 px-2.5 py-1 rounded border border-yellow-500/10">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0" /> {item}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-text-muted font-mono">Loading compliance check details...</p>
                  </div>
                )
              ) : activeModalTab === 'ai' ? (
                /* AI Copilot Tab View */
                <div className="space-y-4">
                  {!aiContent ? (
                    <div className="bg-bg/50 border border-border p-6 rounded-xl text-center space-y-4">
                      <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto">
                        <Sparkles className="w-5 h-5 text-brand animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Synthesize Local SEO Content Copy</h4>
                        <p className="text-[10px] text-text-muted mt-1 max-w-[340px] mx-auto leading-relaxed">
                          Let the AI Assistant write perfect optimized Google Business Profile captions, hashtags, and Instagram listings matching your keyword parameters!
                        </p>
                      </div>
                      <button
                        onClick={generateAiContent}
                        className="bg-brand hover:bg-brand-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-brand/10"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Synthesize Local Captions
                      </button>
                    </div>
                  ) : aiContent.isGenerating ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2">
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full"
                      />
                      <p className="text-xs text-brand font-bold animate-pulse">AI Copilot parsing local entities & keywords...</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      
                      {/* GBP Post Caption */}
                      <div className="bg-bg/40 border border-border rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">Google Business Profile Post Caption</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(aiContent.gbpPost);
                              alert("GBP Post copied to clipboard!");
                            }}
                            className="bg-bg hover:bg-bg-hover border border-border p-1 rounded hover:text-white transition-colors cursor-pointer"
                            title="Copy Copywrite"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-text-muted leading-relaxed whitespace-pre-line bg-bg-panel/40 p-3 rounded-lg border border-border/50">
                          {aiContent.gbpPost}
                        </p>
                      </div>

                      {/* Instagram Caption */}
                      <div className="bg-bg/40 border border-border rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">Instagram Caption</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(aiContent.instaCaption);
                              alert("Instagram caption copied to clipboard!");
                            }}
                            className="bg-bg hover:bg-bg-hover border border-border p-1 rounded hover:text-white transition-colors cursor-pointer"
                            title="Copy Copywrite"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-text-muted leading-relaxed whitespace-pre-line bg-bg-panel/40 p-3 rounded-lg border border-border/50">
                          {aiContent.instaCaption}
                        </p>
                      </div>

                      {/* AI Keyword Suggestions */}
                      <div className="bg-bg/40 border border-border rounded-xl p-4 space-y-2">
                        <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">AI Suggested Latent Keywords</span>
                        <div className="flex flex-wrap gap-1.5">
                          {aiContent.suggestedKeywords.map((tag, idx) => (
                            <span key={idx} className="bg-brand/10 border border-brand/20 text-brand text-[10px] font-medium px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                /* Custom Tweaks Tab View */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Settings className="w-4 h-4 text-brand" /> Fine-Tune Image Metadata & GPS Coordinates
                    </h4>
                    <p className="text-[10px] text-text-muted leading-relaxed">
                      Overwrite default SEO parameters for this specific image to optimize it for a unique service or geo-point.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-text-muted uppercase">Custom Business/Brand Name</label>
                        <input
                          type="text"
                          value={editBusiness}
                          onChange={e => setEditBusiness(e.target.value)}
                          className="w-full bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-brand"
                          placeholder="e.g. Rohan Dental Clinic"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-text-muted uppercase">Image-Specific Focus Keywords</label>
                        <textarea
                          value={editKeywords}
                          onChange={e => setEditKeywords(e.target.value)}
                          rows={3}
                          className="w-full bg-bg border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-main focus:outline-none focus:border-brand resize-none"
                          placeholder="dentist near me, best root canal, cosmetic veneers (comma separated)"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 bg-bg/40 p-4 rounded-xl border border-border/80">
                      <span className="text-[10px] font-bold text-brand uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand" /> Custom Geotag GPS Overrides
                      </span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold text-text-muted">Latitude</label>
                          <input
                            type="number"
                            step="any"
                            value={editLat}
                            onChange={e => setEditLat(e.target.value)}
                            className="w-full bg-bg border border-border rounded-lg px-2 py-1 text-xs font-mono text-text-main focus:outline-none focus:border-brand"
                            placeholder="e.g. 25.253"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-semibold text-text-muted">Longitude</label>
                          <input
                            type="number"
                            step="any"
                            value={editLng}
                            onChange={e => setEditLng(e.target.value)}
                            className="w-full bg-bg border border-border rounded-lg px-2 py-1 text-xs font-mono text-text-main focus:outline-none focus:border-brand"
                            placeholder="e.g. 55.303"
                          />
                        </div>
                      </div>

                      {location && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditLat(location.lat.toString());
                            setEditLng(location.lng.toString());
                          }}
                          className="w-full bg-bg-panel hover:bg-bg-panel/85 border border-border text-[10px] font-bold py-1.5 rounded-lg text-text-main cursor-pointer transition-colors"
                        >
                          Copy Active Pin Lat/Lng
                        </button>
                      )}

                      <p className="text-[9px] text-text-muted leading-normal">
                        * If custom GPS is defined, the optimizer will inject these coordinates instead of the project default map location.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveCustomMetadata}
                    className="w-full bg-brand hover:bg-brand-hover text-black text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand/10"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#000000]" /> Save Custom Overwrites
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <button
                  onClick={() => setPreviewFile(null)}
                  className="bg-bg hover:bg-bg/85 border border-border text-xs font-semibold px-4 py-2 rounded-xl transition-colors text-text-main cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diagnostic Portfolio Audit Results Modal */}
      <AnimatePresence>
        {showAuditModal && auditResults && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAuditModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-bg-panel border border-border/80 w-full max-w-xl rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col gap-4 text-text-main font-sans"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand" />
                  <h3 className="font-bold text-base text-white">SEO Portfolio Audit Report</h3>
                </div>
                <button 
                  onClick={() => setShowAuditModal(false)}
                  className="p-1 hover:bg-bg rounded-md text-text-muted hover:text-text-main cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                
                {/* Aggregate overall portfolio Score card */}
                <div className="bg-gradient-to-br from-brand/20 to-bg-panel border border-brand/30 p-6 rounded-xl text-center space-y-2">
                  <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider block">Average Portfolio Health Score</span>
                  <div className="text-4xl font-black text-white">{auditResults.overallScore} <span className="text-sm font-normal text-text-muted">/ 100</span></div>
                  
                  <div className="flex justify-center">
                    <span className={`px-3 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                      auditResults.overallScore >= 80 ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>
                      {auditResults.overallScore >= 80 ? "HIGH-PERFORMANCE LOCAL SEO STATUS" : "OPTIMIZATIONS REQUIRED"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Passed items list */}
                  <div className="bg-bg/40 p-4 rounded-xl border border-border/60 space-y-2">
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider block">Optimized Standards (Passed)</span>
                    <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {auditResults.passedList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-text-muted">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {auditResults.passedList.length === 0 && (
                        <p className="text-[10px] text-text-muted italic">No items have passed compliance yet.</p>
                      )}
                    </ul>
                  </div>

                  {/* Pending items list */}
                  <div className="bg-bg/40 p-4 rounded-xl border border-border/60 space-y-2">
                    <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block">SEO Gaps Detected (Pending)</span>
                    <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {auditResults.issuesList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-text-muted">
                          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {auditResults.issuesList.length === 0 && (
                        <p className="text-[10px] text-green-400 italic">Excellent! Zero gaps detected in upload library.</p>
                      )}
                    </ul>
                  </div>

                </div>

                <div className="bg-bg-panel/40 p-3 rounded-lg border border-border text-[10px] text-text-muted leading-relaxed">
                  ⚠️ **Agency Recommendation:** Running geocoding injections using LocalLens AI will automatically resolve all missing coordinates, metadata headers, and alt description tags instantly!
                </div>

              </div>

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="bg-bg hover:bg-bg/85 border border-border text-xs font-semibold px-4 py-2 rounded-xl transition-colors text-text-main cursor-pointer"
                >
                  Close Report
                </button>
                <button
                  onClick={() => {
                    setShowAuditModal(false);
                    setAuditOnly(false);
                    handleProcess(false);
                  }}
                  className="bg-brand hover:bg-brand-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Apply Auto-Fix Injections
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

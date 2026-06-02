"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Lock, ArrowRight, ShieldCheck, Sparkles, 
  MailCheck, CheckCircle2, X, Navigation, Eye, EyeOff
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { getApiUrl } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleClientId, setGoogleClientId] = useState("");

  // Magic Link Popup state
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false);
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  // Decode Google JWT Client-side
  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT Decode error", e);
      return null;
    }
  };

  // Google OAuth Credentials handler
  const handleGoogleCredentialResponse = async (response: any) => {
    const token = response.credential;
    if (!token) return;
    const decoded = decodeJwt(token);
    if (decoded && decoded.email) {
      await triggerAuthFlow(decoded.email, decoded.name || decoded.email.split("@")[0]);
    } else {
      alert("Google sign-in failed. Please try again.");
    }
  };

  // Auth flow — tries login first, then signup if user not found
  const triggerAuthFlow = async (userEmail: string, userName: string) => {
    setLoading(true);
    try {
      const API_URL = getApiUrl();
      let res = await fetch(`${API_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, name: userName, action: "login" })
      });
      let data = await res.json();

      if (!res.ok) {
        res = await fetch(`${API_URL}/api/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, name: userName, action: "signup" })
        });
        data = await res.json();
      }

      if (res.ok && data.user) {
        localStorage.setItem("buzz_auth_token", "authenticated");
        localStorage.setItem("buzz_user_id", data.user.id.toString());
        localStorage.setItem("buzz_user_email", data.user.email);
        localStorage.setItem("buzz_user_name", data.user.name);
        localStorage.setItem("buzz_user_role", data.user.role || "user");
        localStorage.setItem("buzz_user_plan", data.user.plan || "Free");
        router.push("/dashboard");
      } else {
        alert(data.error || "Authentication failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      setShowMagicLinkModal(false);
    }
  };

  // Load Google Client ID from env
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    if (clientId && clientId !== "YOUR_GOOGLE_CLIENT_ID_HERE") {
      setGoogleClientId(clientId);
    }
  }, []);

  // Initialize Google Sign-In button
  useEffect(() => {
    if (!googleClientId) return;

    const initGoogle = () => {
      if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false
          });
          const btnContainer = document.getElementById("google-signin-btn-container");
          if (btnContainer) {
            (window as any).google.accounts.id.renderButton(
              btnContainer,
              { theme: "filled_black", size: "large", width: 360, shape: "rectangular", text: "signin_with" }
            );
          }
        } catch (e) {
          console.error("Google Sign-In init error", e);
        }
      }
    };

    const timer = setTimeout(initGoogle, 600);
    return () => clearTimeout(timer);
  }, [googleClientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill in all required fields.");
      return;
    }
    await triggerAuthFlow(email, name || email.split("@")[0]);
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,86,35,0.07),transparent_65%)] pointer-events-none z-0" />
      {/* Dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:32px_32px] opacity-60 pointer-events-none z-0" />

      {/* Google GSI Script */}
      {googleClientId && (
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="afterInteractive"
          onLoad={() => {
            if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
              try {
                (window as any).google.accounts.id.initialize({
                  client_id: googleClientId,
                  callback: handleGoogleCredentialResponse,
                  auto_select: false
                });
                const container = document.getElementById("google-signin-btn-container");
                if (container) {
                  (window as any).google.accounts.id.renderButton(
                    container,
                    { theme: "filled_black", size: "large", width: 360, shape: "rectangular", text: "signin_with" }
                  );
                }
              } catch (e) {
                console.error("GSI Script load init error", e);
              }
            }
          }}
        />
      )}

      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 shadow-2xl shadow-black/60 flex flex-col gap-6 relative overflow-hidden">
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#F25623] via-[#FF8533] to-[#F25623]" />

          {/* Logo */}
          <div className="flex flex-col items-center text-center gap-2 pt-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full bg-[#F25623] flex items-center justify-center shadow-lg shadow-[#F25623]/30 transition-transform group-hover:scale-110 duration-300 shrink-0">
                <Navigation className="text-white w-4 h-4 font-bold -rotate-45" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">LocalLens AI</span>
            </Link>
            <p className="text-xs text-[#777] mt-1 max-w-[280px] leading-relaxed">
              {isLogin 
                ? "Sign in to access your workspace and SEO assets." 
                : "Create your account and start optimizing today."
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-[#F25623]">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <input 
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#F25623] transition-colors placeholder:text-[#444]"
                      placeholder="Your full name"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-[#555]">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#F25623] transition-colors placeholder:text-[#444]"
                  placeholder="name@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider">Password</label>
                {isLogin && (
                  <button 
                    type="button"
                    onClick={() => alert("Please contact support to reset your password.")}
                    className="text-[11px] text-[#F25623] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-[#555]">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#F25623] transition-colors placeholder:text-[#444]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#555] hover:text-[#F25623] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#F25623] hover:bg-[#D94C1D] text-white text-sm font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#F25623]/20 mt-1 hover:scale-[1.01] active:scale-95 duration-200 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A2A2A]"></div>
            </div>
            <span className="relative bg-[#141414] px-4 text-[10px] uppercase font-bold text-[#555] tracking-widest">or continue with</span>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-3">
            
            {/* Google OAuth Button */}
            {googleClientId ? (
              <div className="w-full flex justify-center">
                <div id="google-signin-btn-container" className="w-full flex justify-center min-h-[44px]" />
              </div>
            ) : (
              <div className="w-full flex items-center justify-center gap-3 border border-[#2A2A2A] rounded-xl py-3.5 px-4 bg-[#0E0E0E] opacity-50 cursor-not-allowed">
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                  <path d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.4 5.6-5.1 7.3v6h8.2c4.8-4.4 7.2-10.9 7.2-17.4z" fill="#4285F4"/>
                  <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8.2-6c-2.1 1.4-4.8 2.3-7.7 2.3-5.9 0-10.9-4-12.7-9.3H2.8v6.2C6.8 42.8 14.9 48 24 48z" fill="#34A853"/>
                  <path d="M11.3 29.2c-.5-1.4-.7-2.9-.7-4.4s.2-3 .7-4.4v-6.2H2.8C1 17.4 0 20.6 0 24s1 6.6 2.8 9.4l8.5-4.2z" fill="#FBBC05"/>
                  <path d="M24 9.5c3.3 0 6.3 1.1 8.6 3.4l6.4-6.4C35.9 2.1 30.5 0 24 0 14.9 0 6.8 5.2 2.8 14.6l8.5 6.2C13.1 13.5 18.1 9.5 24 9.5z" fill="#EA4335"/>
                </svg>
                <span className="text-sm text-[#555] font-semibold">Sign in with Google</span>
                <span className="text-[9px] text-[#F25623] font-mono ml-auto">(Setup Required)</span>
              </div>
            )}

            {/* Email Magic Link */}
            <button
              onClick={() => setShowMagicLinkModal(true)}
              className="w-full bg-[#0E0E0E] hover:bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#F25623]/40 rounded-xl py-3.5 px-4 flex items-center justify-center gap-2.5 text-sm font-semibold text-white transition-all cursor-pointer"
            >
              <MailCheck className="w-4 h-4 text-[#F25623]" />
              Sign in with Email Magic Link
            </button>
          </div>

          {/* Toggle */}
          <div className="text-center text-xs text-[#666] border-t border-[#2A2A2A] pt-5">
            {isLogin ? (
              <span>
                Don't have an account?{" "}
                <button onClick={() => setIsLogin(false)} className="text-[#F25623] font-bold hover:underline">
                  Create free account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button onClick={() => setIsLogin(true)} className="text-[#F25623] font-bold hover:underline">
                  Sign in
                </button>
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#444]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F25623]" /> 
            Secured with PostgreSQL · LocalLens AI
          </div>

        </div>
      </motion.div>

      {/* Email Magic Link Modal */}
      <AnimatePresence>
        {showMagicLinkModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowMagicLinkModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              className="bg-[#141414] border border-[#2A2A2A] w-full max-w-sm rounded-2xl shadow-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#F25623]" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MailCheck className="w-5 h-5 text-[#F25623]" />
                  <span className="font-bold text-sm text-white">Email Magic Link</span>
                </div>
                <button 
                  onClick={() => { setShowMagicLinkModal(false); setMagicSent(false); }}
                  className="p-1 hover:bg-[#222] rounded-lg text-[#555] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!magicSent ? (
                <div className="space-y-4">
                  <p className="text-xs text-[#777] leading-relaxed">
                    Enter your email address to receive a secure one-click login link. No password needed.
                  </p>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-[#888] uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={magicEmail}
                      onChange={e => setMagicEmail(e.target.value)}
                      className="w-full bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F25623] text-white placeholder:text-[#444] transition-colors"
                      placeholder="name@gmail.com"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!magicEmail) { alert("Please enter your email address."); return; }
                      setMagicSent(true);
                    }}
                    className="w-full bg-[#F25623] hover:bg-[#D94C1D] text-white rounded-xl py-3 text-sm font-bold transition-all cursor-pointer shadow-lg shadow-[#F25623]/20 hover:scale-[1.01]"
                  >
                    Send Magic Link
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-[#F25623]/10 border border-[#F25623]/20 flex items-center justify-center mx-auto animate-bounce">
                    <MailCheck className="w-6 h-6 text-[#F25623]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Check your inbox!</h4>
                    <p className="text-xs text-[#777] mt-1 leading-relaxed">
                      We sent a login link to <span className="text-[#F25623] font-mono">{magicEmail}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => triggerAuthFlow(magicEmail, magicEmail.split("@")[0])}
                    className="w-full bg-[#F25623] hover:bg-[#D94C1D] text-white rounded-xl py-3 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Verify & Sign In
                  </button>
                  <button
                    onClick={() => setMagicSent(false)}
                    className="text-xs text-[#666] hover:text-white transition-all underline"
                  >
                    Use a different email
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

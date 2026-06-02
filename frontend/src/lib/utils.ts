import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the backend API base URL.
 * Uses NEXT_PUBLIC_API_URL env var in production (set to your Railway/Render URL).
 * Falls back to localhost:4000 in local development.
 */
export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  // If explicitly set (like on Vercel) and is a remote URL, use it
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }
  
  // Client-side fallback for local WiFi network or custom local hostnames
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalIp = /^192\.168\.\d+\.\d+$/.test(hostname) ||
                      /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
                      /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(hostname) ||
                      hostname === "127.0.0.1";
    if (isLocalIp) {
      return `http://${hostname}:4000`;
    }
  }
  
  return envUrl || "http://localhost:4000";
}

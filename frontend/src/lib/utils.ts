import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the backend API base URL.
 * - If NEXT_PUBLIC_API_URL is set, always use it (works for both localhost and remote).
 * - If accessing from a LAN IP (e.g. 192.168.x.x), auto-detect the backend on port 4000.
 * - Falls back to http://localhost:4000.
 */
export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  // If an env var is explicitly set, use it.
  // But if it's pointing to localhost and we are accessing from a different IP (like a LAN IP on a phone), rewrite it.
  if (envUrl) {
    if (typeof window !== "undefined" && envUrl.includes("localhost")) {
      const hostname = window.location.hostname;
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
        return envUrl.replace("localhost", hostname);
      }
    }
    return envUrl;
  }

  // Client-side: if opened from a LAN IP, point backend to the same host on port 4000
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalIp =
      /^192\.168\.\d+\.\d+$/.test(hostname) ||
      /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(hostname) ||
      hostname === "127.0.0.1";
    if (isLocalIp) {
      return `http://${hostname}:6767`;
    }
  }

  return "http://localhost:6767";
}

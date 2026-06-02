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
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

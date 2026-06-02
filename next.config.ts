import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // exiftool-vendored runs server-side only; keep it out of the browser bundle
  serverExternalPackages: ["exiftool-vendored", "sharp"],

  // Increase serverless function body size limit for image uploads
  experimental: {},

  // Image domain configuration for next/image (if used in future)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

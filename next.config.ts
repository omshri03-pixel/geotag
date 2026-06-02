import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["exiftool-vendored"],
  // @ts-ignore
  turbopack: {
    root: "./", // Use string path instead of __dirname
  },
  // Allow network access from local WiFi devices
  allowedDevOrigins: [
    "192.168.1.7",
    "192.168.0.*",
    "192.168.1.*",
    "192.168.29.59",
    "192.168.29.*",
  ],
};

export default nextConfig;

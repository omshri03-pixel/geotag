import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // @ts-ignore
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Allow network access from local WiFi devices
  allowedDevOrigins: [
    "localhost:6969",
    "127.0.0.1:6969",
    "192.168.0.*",
    "192.168.1.*",
    "192.168.29.*",
  ],
};

export default nextConfig;

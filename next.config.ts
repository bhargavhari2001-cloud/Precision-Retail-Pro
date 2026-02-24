import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure papaparse runs only in the browser
  serverExternalPackages: [],
};

export default nextConfig;

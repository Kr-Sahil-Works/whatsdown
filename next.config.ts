import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "aware-axolotl-288.convex.cloud",
    },
    {
      protocol: "https",
      hostname: "*.r2.cloudflarestorage.com",
    },
  ],
},

};

export default nextConfig;

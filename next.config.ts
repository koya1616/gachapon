import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://pub-099ffcea7b594ca6b20f500e6339a2c8.r2.dev/**")],
  },
};

export default nextConfig;

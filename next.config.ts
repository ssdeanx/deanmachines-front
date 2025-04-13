import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx"],
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
  },
};

export default nextConfig;

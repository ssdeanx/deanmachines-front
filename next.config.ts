import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/*"],
  pageExtensions: ["ts", "tsx", "mdx"],
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
  },
};

export default withContentlayer(nextConfig);

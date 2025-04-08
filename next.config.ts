import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      // ...
    },
  },
};

export default withContentlayer(nextConfig);

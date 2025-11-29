import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Ensure server actions are enabled (default in Next 14/15)
    }
  },
  // Transpile RxDB and Cosmograph as they are ESM only packages often requiring this
  transpilePackages: ['rxdb', '@cosmograph/react'],
};

export default nextConfig;

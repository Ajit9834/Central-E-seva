import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from client bundle
      config.externals = {
        ...config.externals,
        'child_process': 'commonjs child_process',
        'fs': 'commonjs fs',
        'path': 'commonjs path',
        'os': 'commonjs os',
        'mongodb': 'commonjs mongodb',
        '@lib/mongodb': 'commonjs @lib/mongodb',
        '@models/Document': 'commonjs @models/Document',
      };
      
      // Add fallbacks for Node.js built-in modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        child_process: false,
      };
    }
    return config;
  },
};

export default nextConfig;

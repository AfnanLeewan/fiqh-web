import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
};

export default nextConfig;

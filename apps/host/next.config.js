/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@epic/core', '@epic/ui'],
  experimental: {
    // Enable WASM imports
    webpackBuildWorker: true,
    serverComponentsExternalPackages: ['@epic/core'],
  },
  webpack(config) {
    // Handle WASM modules
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
  // Vercel Edge runtime by default
  runtime: 'edge',
};

module.exports = nextConfig;

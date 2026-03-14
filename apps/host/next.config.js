/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@epic/core', '@epic/ui', '@epic/bus', '@epic/db'],
  experimental: {
    serverComponentsExternalPackages: ['@epic/core'],
  },
  webpack(config, { isServer }) {
    // Handle WASM modules
    config.experiments = { 
      ...config.experiments, 
      asyncWebAssembly: true,
      layers: true 
    };
    
    // Ignore .wasm files in node_modules for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  // Output standalone for Vercel
  output: 'standalone',
};

module.exports = nextConfig;

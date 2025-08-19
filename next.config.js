/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize for Netlify deployment
  trailingSlash: true,
  
  // Image optimization configuration for Netlify
  images: {
    unoptimized: true,
  },
  
  // Remove standalone output for better Netlify compatibility
  // output: 'standalone',
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
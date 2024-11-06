/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable Edge runtime for all API routes
    runtime: "edge",
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Example of optimizing bundle size for Edge Functions in client-side bundles
      config.optimization.splitChunks = {
        chunks: "all", // Split large code into smaller chunks for Edge functions
      };
    }
    return config;
  },
  reactStrictMode: true, // Optional: Enables React Strict Mode (for development)
};

export default nextConfig;

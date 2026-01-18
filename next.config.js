/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for deployment
  experimental: {
    // Reduce bundle size
    optimizePackageImports: ['react-leaflet', 'leaflet']
  },
  // Ensure proper handling of dynamic routes
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Add any custom config here
};

module.exports = nextConfig;
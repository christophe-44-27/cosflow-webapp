import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour le déploiement sur Render
  output: 'standalone',

  // Optimisations d'images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.cosflow.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;

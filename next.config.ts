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
      {
        protocol: 'https',
        hostname: 'cosflow-media.s3.ca-central-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'd1f4vr4f1px6z.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;

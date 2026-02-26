import type { NextConfig } from "next";

// Validation des variables d'environnement requises
const requiredEnvVars = [
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_APP_URL',
] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(
      `[Cosflow] Variable d'environnement manquante : ${key}\n` +
      `Consultez .env.example pour la liste complète des variables requises.`
    );
  }
}

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

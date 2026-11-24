import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: __dirname,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: false,
        followSymlinks: false,
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/.git/**',
          '**/pagefile.sys',
          '**/hiberfil.sys',
          '**/swapfile.sys',
          '**/DumpStack.log.tmp',
        ],
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['typeorm', 'mssql', 'reflect-metadata'],

  ...(!process.env.TURBOPACK && {
    webpack: (config, { isServer }) => {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      };

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
  }),
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    domains: ['img.clerk.com'],
  },
  webpack: (config) => {
    // Exclude supabase functions from webpack compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/supabase/functions/**']
    };
    return config;
  }
};

export default nextConfig;


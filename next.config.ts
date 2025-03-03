import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  env: {
    AUTH_TRUST_HOST: "true",
  },
};

export default nextConfig;

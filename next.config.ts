import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  basePath: '/es/logica1',
  assetPrefix: '/es/logica1/',
};

export default nextConfig;

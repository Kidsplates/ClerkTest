// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },   // ← ESLintエラーで本番buildを落とさない
  // （必要なら）型エラーも無視したい場合は下をON
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;

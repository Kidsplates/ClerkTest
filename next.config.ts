/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },   // ← 本番ビルドでESLintを無視
  typescript: { ignoreBuildErrors: true } // ← 型エラーも一時的に無視（必要なら）
};

module.exports = nextConfig;

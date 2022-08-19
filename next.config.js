/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * We need to dead-code eliminate `typeof window === "undefined"`
   * https://github.com/vercel/next.js/issues/30892
   */
  swcMinify: false,
};

module.exports = nextConfig;

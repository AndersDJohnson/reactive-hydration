/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push({
        test: /ServerComponent\b/,
        use: "null-loader",
      });
    }

    return config;
  },
};

module.exports = nextConfig;

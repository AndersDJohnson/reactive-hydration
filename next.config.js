/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push({
        // Note: loader functions should have a `ServerComponentLoader` suffix
        // to avoid being excluded by this rule.
        test: /ServerComponent\b/,
        use: "null-loader",
      });
    }

    return config;
  },
};

module.exports = nextConfig;

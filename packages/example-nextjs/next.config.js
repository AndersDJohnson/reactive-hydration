// const webpack = require("webpack");

const BUILD_EXPORT = process.env.BUILD_EXPORT;

const withTM = require("next-transpile-modules")([
  "reactive-hydration",
  "reactive-hydration-example-common",
]);

module.exports = () => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    basePath: BUILD_EXPORT
      ? "/reactive-hydration/packages/example-nextjs/out"
      : "",

    reactStrictMode: true,

    swcMinify: true,

    webpack(config, { isServer }) {
      if (!isServer) {
        const originalChunks = config.optimization.splitChunks.chunks;

        config.optimization.splitChunks.chunks = (chunk) => {
          if (
            chunk.name?.startsWith("component-") ||
            chunk.name?.startsWith("context-")
          ) {
            return false;
          }

          return originalChunks(chunk);
        };
      }

      return config;
    },
  };

  return withTM(nextConfig);
};

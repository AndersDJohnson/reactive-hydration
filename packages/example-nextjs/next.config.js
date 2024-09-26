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

    webpack(config, options) {
      if (!options.isServer) {
        // Just for demo.
        config.optimization.splitChunks.minSize = 0;
      }

      return config;
    },
  };

  return withTM(nextConfig);
};

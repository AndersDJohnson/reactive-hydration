const webpack = require("webpack");

const BUILD_EXPORT = process.env.BUILD_EXPORT;

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
    // swcMinify: false,

    webpack(config, { isServer }) {
      // config.optimization.minimize = false;

      // if (!isServer) {
      //   config.module.rules.push({
      //     // Note: loader functions should have a `*ServerComponent/loader.ts` path
      //     // to avoid being excluded by this rule.
      //     test: /ServerComponent\/index/,
      //     use: "null-loader",
      //   });
      // }

      // config.plugins = [
      //   ...config.plugins,
      //   new webpack.NormalModuleReplacementPlugin(
      //     /^react[/]?/,
      //     require
      //       .resolve("reactive-hydration/dist/react")
      //       .replace("/index.js", "")
      //   ),
      //   new webpack.NormalModuleReplacementPlugin(
      //     /^_react[/]?/,
      //     require.resolve("react").replace("/index.js", "")
      //   ),
      // ];

      // config.resolve = {
      //   ...config.resolve,
      //   alias: {
      //     ...config.resolve.alias,
      //     // react: require
      //     //   .resolve("reactive-hydration/dist/react")
      //     //   .replace("/index.js", ""),
      //     // _react: require.resolve("react").replace("/index.js", ""),
      //   },
      // };

      return config;
    },
  };

  return nextConfig;
};

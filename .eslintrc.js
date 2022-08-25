module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:react-hooks/recommended"],
  rules: {
    "react-hooks/exhaustive-deps": "error",
    // This doesn't work for global TypeScript types, but TypeScript already handles this.
    "no-undef": "off",
    "no-unused-vars": [
      "error",
      {
        // This doesn't work for TypeScript function types.
        args: "none",
        ignoreRestSiblings: true,
      },
    ],
  },
};

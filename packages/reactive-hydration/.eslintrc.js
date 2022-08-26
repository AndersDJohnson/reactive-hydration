module.exports = {
  extends: ["../../.eslintrc.js"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          // {
          //   name: "react",
          //   importNames: ["useState", "useContext"],
          //   message:
          //     "Unless you want monkeypatched versions internally, you probably mean import to these from './src/react-actual.ts' - otherwise feel free to disble the rule in this instance.",
          // },
        ],
      },
    ],
  },
};

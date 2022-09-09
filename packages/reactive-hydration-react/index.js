/* eslint-disable react-hooks/rules-of-hooks */
const ReactActual = require("react-actual");
const { makeJsx } = require("./makeJsx");

const React = { ...ReactActual };

// Destructuring could transpile to live lookup below and therefore infinite loops.
// Not capturing these before importing from `react-hydration` would cause infinite loops.
const useState = React.useState;
const useContext = React.useContext;

// Direct imports to avoid `react-dom` import in `ReactiveHydrationContainerInner` - still needed?
const {
  useStateSerialize,
} = require("reactive-hydration/dist-no-jsx-runtime/useStateSerialize");
const {
  useContextUsageTracker,
} = require("reactive-hydration/dist-no-jsx-runtime/useContextUsageTracker");
// const {
//   useStateSerialize,
//   useContextUsageTracker,
// } = require("reactive-hydration/dist-no-jsx-runtime");

React.createElement = makeJsx("createElement", React);

React.useState = (init, bypass) => {
  if (bypass) {
    return useState(init);
  }

  return useStateSerialize(init);
};

React.useContext = (init, bypass) => {
  if (bypass) {
    return useContext(init);
  }

  return useContextUsageTracker(init);
};

module.exports = React;

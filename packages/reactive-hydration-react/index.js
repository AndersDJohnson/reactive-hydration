/* eslint-disable react-hooks/rules-of-hooks */
const ReactActual = require("_react");
const { makeJsx } = require("./makeJsx");

const React = { ...ReactActual };

// Destructuring could transpile to live lookup below and therefore infinite loops.
// Not capturing these before importing from `react-hydration` would cause infinite loops.
const useState = React.useState;
const useContext = React.useContext;

// Direct imports to avoid `react-dom` import in `ReactiveHydrationContainerInner` - still needed?
const {
  useStateSerialize,
} = require("reactive-hydration/dist/useStateSerialize");
const {
  useContextUsageTracker,
} = require("reactive-hydration/dist/useContextUsageTracker");

// console.log("*** reactive-hydration-react index _react id", React.id);

React.createElement = makeJsx("createElement", React);

React.useState = (init, bypass) => {
  // console.log(
  //   "*** reactive-hydration-react/index useState _react id",
  //   React.id,
  //   "bypass",
  //   bypass
  // );

  if (bypass) {
    return useState(init);
  }

  return useStateSerialize(init);
};

React.useContext = (init, bypass) => {
  // console.log(
  //   "*** reactive-hydration-react/index useContext _react id",
  //   React.id
  // );

  // return useContext(init);

  if (bypass) {
    return useContext(init);
  }

  return useContextUsageTracker(init);
};

module.exports = React;

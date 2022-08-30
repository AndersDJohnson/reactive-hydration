/* eslint-disable react-hooks/rules-of-hooks */
const React = require("_react");
const { makeJsx } = require("./makeJsx");

// Destructuring could transpile to live lookup below and therefore infinite loops.
// Not capturing these before importing from `react-hydration` will cause infinite loops.
const useState = React.useState;
const useContext = React.useContext;
const createElement = React.createElement;

// It works with just this imported, but not used...
const {
  useStateSerialize,
} = require("reactive-hydration/dist/useStateSerialize");

console.log("*** reactive-hydration-react index _react id", React.id);

React.createElement = makeJsx("createElement", createElement);

React.useState = (init, bypass) => {
  console.log(
    "*** reactive-hydration-react/index useState _react id",
    React.id,
    "bypass",
    bypass
  );

  // // It works with just this, even if we've imported `useStateSerialize` but not using
  // return useState(init);

  if (bypass) {
    return useState(init);
  }

  return useStateSerialize(init);
};

React.useContext = (init) => {
  console.log(
    "*** reactive-hydration-react/index useContext _react id",
    React.id
  );

  return useContext(init);
};

module.exports = React;

/* eslint-disable react-hooks/rules-of-hooks */
const React = require("_react");

// Destructuring could transpile to live lookup below and therefore infinite loops.
// Not capturing these before importing from `react-hydration` will cause infinite loops.
const useState = React.useState;
const useContext = React.useContext;

// const {
//   useStateSerialize,
// } = require("reactive-hydration/dist/useStateSerialize");

console.log("*** reactive-hydration-react index _react id", React.id);

React.useState = (init, bypass) => {
  console.log(
    "*** reactive-hydration-react/index useState _react id",
    React.id,
    "bypass",
    bypass
  );

  return useState(init);

  // if (bypass) {
  //   return useState(init);
  // }

  // return useStateSerialize(init);
};

React.useContext = (init) => {
  console.log(
    "*** reactive-hydration-react/index useContext _react id",
    React.id
  );

  return useContext(init);
};

module.exports = React;

const React = require("react-non-aliased");
const {
  ReactiveHydrateContext,
} = require("../dist/ReactiveHydrateContext/ReactiveHydrateContext");

console.log("*** React", React);
const { useState, useContext } = React;

const YourContext = React.createContext({});

React.useState = (...args) => {
  const context = useContext(YourContext);

  console.log("*** context", context);

  return useState(...args);
};

module.exports = React;

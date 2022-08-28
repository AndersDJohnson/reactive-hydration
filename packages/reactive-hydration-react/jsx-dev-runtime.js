const jsxDevRuntime = require("_react/jsx-dev-runtime");

const { jsxDEV: origJsxDEV } = jsxDevRuntime;

const React = require("_react");

const { useState } = React;

console.log("*** reactive-hydration-react/jsx-dev-runtime _react id", React.id);

const jsxDEV = (type, ...args) => {
  const Wrapper = () => {
    const [state, setState] = useState(true);

    console.log(
      "*** reactive-hydration-react/jsx-dev-runtime Wrapper state",
      state
    );

    return origJsxDEV(type, ...args);
  };

  Wrapper.displayName = "Wrapper";

  return origJsxDEV(Wrapper, ...args);
};

jsxDevRuntime.jsxDEV = jsxDEV;

module.exports = jsxDevRuntime;

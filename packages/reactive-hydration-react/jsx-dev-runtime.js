const jsxDevRuntime = require("_react/jsx-dev-runtime");

const { jsxDEV: origJsxDEV } = jsxDevRuntime;

const React = require("_react");
const { useEffect } = require("_react");

const { useState } = React;

console.log("*** reactive-hydration-react/jsx-dev-runtime _react id", React.id);

const jsxDEV = (type, ...args) => {
  const [props, ...restArgs] = args;

  const Wrapper = () => {
    const [state, setState] = useState(() => Math.random());

    console.log(
      "*** reactive-hydration-react/jsx-dev-runtime Wrapper state",
      state
    );

    useEffect(() => {
      const i = setInterval(() => {
        setState(Math.random());
      }, 1000);

      return () => {
        clearInterval(i);
      };
    }, []);

    return origJsxDEV(
      type,
      {
        ...props,
        "data-test-useState": state,
      },
      ...restArgs
    );
  };

  Wrapper.displayName = "Wrapper";

  return origJsxDEV(Wrapper, ...args);
};

jsxDevRuntime.jsxDEV = jsxDEV;

module.exports = jsxDevRuntime;

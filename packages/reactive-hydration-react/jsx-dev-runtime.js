const jsxDevRuntime = require("_react/jsx-dev-runtime");

const { jsxDEV: origJsxDEV } = jsxDevRuntime;

const React = require("_react");

const { useContext } = React;

const {
  SerializedStateContext,
} = require("reactive-hydration/dist/SerializedStateContext");

console.log("*** reactive-hydration-react/jsx-dev-runtime _react id", React.id);

const jsxDEV = (type, ...args) => {
  const [props, ...restArgs] = args;

  const Wrapper = () => {
    const serializedStateContext = useContext(SerializedStateContext);

    console.log(
      "*** reactive-hydration-react/jsx-dev-runtime Wrapper serializedStateContext",
      serializedStateContext
    );

    return origJsxDEV(type, props, ...restArgs);
  };

  Wrapper.displayName = "Wrapper";

  return origJsxDEV(Wrapper, ...args);
};

jsxDevRuntime.jsxDEV = jsxDEV;

module.exports = jsxDevRuntime;

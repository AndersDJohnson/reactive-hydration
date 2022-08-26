const jsxDevRuntime = require("_react/jsx-dev-runtime");

const origJsxDev = jsxDevRuntime.jsxDEV;

jsxDevRuntime.jsxDEV = (type, props) => {
  console.log("*** jsxDEV", type);

  return origJsxDev(type, props);
};

module.exports = jsxDevRuntime;

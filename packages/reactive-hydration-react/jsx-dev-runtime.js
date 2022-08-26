const jsxDevRuntime = require("_react/jsx-dev-runtime");

const origJsxDev = jsxDevRuntime.jsxDEV;

jsxDevRuntime.jsxDEV = (...args) => {
  console.log("*** jsxDEV", args);

  return origJsxDev(...args);
};

module.exports = jsxDevRuntime;

const jsxDevRuntime = require("_react/jsx-dev-runtime");
// const { logRender } = require("./log");

const origJsxDev = jsxDevRuntime.jsxDEV;

jsxDevRuntime.jsxDEV = (type, props, ...rest) => {
  // logRender("*** jsxDEV", type);

  return origJsxDev(type, props, ...rest);
};

module.exports = jsxDevRuntime;

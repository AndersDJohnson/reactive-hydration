const jsxDevRuntime = require("_react/jsx-dev-runtime");
const { logRender } = require("./log");

const origJsxDev = jsxDevRuntime.jsxDEV;

jsxDevRuntime.jsxDEV = (type, props) => {
  logRender("*** createElement", type);

  return origJsxDev(type, props);
};

module.exports = jsxDevRuntime;

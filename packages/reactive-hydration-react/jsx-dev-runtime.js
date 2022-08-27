const jsxDevRuntime = require("_react/jsx-dev-runtime");
// const { logRender } = require("./log");
const { makeJsx } = require("./makeJsx");

jsxDevRuntime.jsxDEV = makeJsx("jsxDEV", jsxDevRuntime.jsxDEV);

module.exports = jsxDevRuntime;

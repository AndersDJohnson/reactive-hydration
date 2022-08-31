const jsxDevRuntime = require("_react/jsx-dev-runtime");
const { makeJsx } = require("./makeJsx");

jsxDevRuntime.jsxDEV = makeJsx("jsxDEV", jsxDevRuntime);

module.exports = jsxDevRuntime;

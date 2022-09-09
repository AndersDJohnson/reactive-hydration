const jsxDevRuntime = require("react-actual/jsx-dev-runtime");
const { makeJsx } = require("./makeJsx");

jsxDevRuntime.jsxDEV = makeJsx("jsxDEV", jsxDevRuntime);

module.exports = jsxDevRuntime;

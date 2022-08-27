const jsxDevRuntime = require("_react/jsx-dev-runtime");
// const { logRender } = require("./log");
const { makeJsx } = require("./makeJsx");

console.log("*** jsxDevRuntime.jsxDEV", jsxDevRuntime.jsxDEV);

// // TODO: Do we need to override this one?
jsxDevRuntime.jsxDEV = makeJsx("jsxDEV", jsxDevRuntime.jsxDEV);

module.exports = jsxDevRuntime;

const jsxRuntime = require("react-actual/jsx-runtime");
const { makeJsx } = require("./makeJsx");

jsxRuntime.jsx = makeJsx("jsx", jsxRuntime);
// jsxRuntime.jsxs = makeJsx("jsxs", jsxRuntime.jsxs);

module.exports = jsxRuntime;

const jsxRuntime = require("_react/jsx-runtime");
const { makeJsx } = require("./makeJsx");

jsxRuntime.jsx = makeJsx("jsx", jsxRuntime.jsx);
jsxRuntime.jsxs = makeJsx("jsxs", jsxRuntime.jsxs);

module.exports = jsxRuntime;

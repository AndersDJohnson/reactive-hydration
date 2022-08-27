const jsxRuntime = require("_react/jsx-runtime");
const { makeJsx } = require("./makeJsx");

console.log("*** reactive-hydration-react jsx-runtime", jsxRuntime.id);

jsxRuntime.jsx = makeJsx("jsx", jsxRuntime.jsx);
// TODO: Do we need to override this one for static children?
// jsxRuntime.jsxs = makeJsx("jsxs", jsxRuntime.jsxs);

module.exports = jsxRuntime;

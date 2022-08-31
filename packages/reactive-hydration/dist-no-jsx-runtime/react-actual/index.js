"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContext = exports.useState = void 0;
var _react_1 = require("_react");
// const React: typeof import("_react") =
//   typeof window !== "undefined" && window.React
//     ? window.React
//     : require("_react");
// console.log(
//   "*** reactive-hydration react-actual React.id",
//   // @ts-expect-error Just for debugging
//   React.id
// );
// if (typeof window !== "undefined") {
//   window.React = window.React || React;
// }
// const {
//   useState: useStateActual,
//   useContext: useContextActual,
//   // useCallback,
//   // useRef,
// } = React;
var useState = function (init) {
    console.log("*** useStateActual");
    return (0, _react_1.useState)(init, 
    // @ts-expect-error The bypass argument is checked in our `jsx-runtime` monkeypatches.
    true);
};
exports.useState = useState;
var useContext = function (context) {
    console.log("*** useContextActual");
    return (0, _react_1.useContext)(context, 
    // @ts-expect-error The bypass argument is checked in our `jsx-runtime` monkeypatches.
    true);
};
exports.useContext = useContext;
// For a time we were considering only importing from `react-actual` in this whole module, so other exports were needed. But it seemed to override `useState` wrapper above.
// export { useCallback, useRef };
// export default React;
// module.exports = React;

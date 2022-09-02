"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveHydrate = void 0;
// var jsx_runtime_1 = require("react/jsx-runtime");
var _react_1 = require("_react");
var react_actual_1 = require("../react-actual");
var ReactiveHydrateContext_1 = require("../ReactiveHydrateContext");
var ReactiveHydrationContainerContext_1 = require("../ReactiveHydrationContainerContext");
var forceHydrate = typeof window === "object"
    ? window.location.search.includes("forceHydrate")
    : false;
/**
 * On server we'll create a wrapper `div` as a portal host to mount into,
 * but on the client we don't want that wrapper or else we'll get extra nesting.
 */
var ReactiveHydrate = function (props) {
    var idProp = props.id;
    var defaultId = (0, _react_1.useId)();
    var id = idProp !== null && idProp !== void 0 ? idProp : defaultId;
    var reactiveHydratingId = (0, react_actual_1.useContext)(ReactiveHydrateContext_1.ReactiveHydrateContext).reactiveHydratingId;
    var reactiveHydrationContainerContext = (0, react_actual_1.useContext)(ReactiveHydrationContainerContext_1.ReactiveHydrationContainerContext);
    var isWithinReactiveHydrationContainer = (reactiveHydrationContainerContext !== null && reactiveHydrationContainerContext !== void 0 ? reactiveHydrationContainerContext : {}).isWithinReactiveHydrationContainer;
    console.log("*** ReactiveHydrate isWithinReactiveHydrationContainer", isWithinReactiveHydrationContainer);
    if (!isWithinReactiveHydrationContainer) {
        return (0, global.jsx_runtime_1.jsx)(global.jsx_runtime_1.Fragment, { children: props.children });
    }
    // TODO: Is this still needed?
    var isHydratingSelf = reactiveHydratingId === id;
    return ((0, global.jsx_runtime_1.jsx)(global.jsx_runtime_1.Fragment, { children: typeof window !== "object" || !isHydratingSelf || forceHydrate ? ((0, global.jsx_runtime_1.jsx)("div", __assign({ "data-component": props.name, "data-states": props.states, "data-id": id, "data-loaded": typeof window === "object" }, { children: props.children }))) : ((0, global.jsx_runtime_1.jsx)(global.jsx_runtime_1.Fragment, { children: props.children })) }));
};
exports.ReactiveHydrate = ReactiveHydrate;
exports.ReactiveHydrate.reactiveHydrateSkip = true;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveHydrationContainerContext = void 0;
var _react_1 = require("_react");
exports.ReactiveHydrationContainerContext = (0, _react_1.createContext)({
    isWithinReactiveHydrationContainer: false,
    hasSoftRouted: false,
});
exports.ReactiveHydrationContainerContext.displayName =
    "ReactiveHydrationContainerContext";
if (typeof global !== "undefined") {
    // @ts-expect-error
    if (global.ReactiveHydrationContainerContext) {
        module.exports =
            // @ts-expect-error
            global.ReactiveHydrationContainerContext;
    }
    else {
        // @ts-expect-error
        global.ReactiveHydrationContainerContext = exports;
    }
}
// // @ts-expect-error For debugging only.
// ReactiveHydrationContainerContext.id = Math.random();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContextUsageTracker = void 0;
var react_actual_1 = require("../react-actual");
var ReactiveHydrateContext_1 = require("../ReactiveHydrateContext");
var ReactiveHydrationContainerContext_1 = require("../ReactiveHydrationContainerContext");
var useContextUsageTracker = function (Context) {
    var contextValue = (0, react_actual_1.useContext)(Context);
    var isWithinReactiveHydrationContainer = (0, react_actual_1.useContext)(ReactiveHydrationContainerContext_1.ReactiveHydrationContainerContext).isWithinReactiveHydrationContainer;
    var usedHooksRef = (0, react_actual_1.useContext)(ReactiveHydrateContext_1.ReactiveHydrateContext).usedHooksRef;
    (0, react_actual_1.useState)(function () {
        var _a;
        if (!isWithinReactiveHydrationContainer)
            return;
        if (!Context.displayName) {
            // const message = "Not serializing context without a `displayName`.";
            // console.debug(message, context);
            // throw new Error(message);
            return;
        }
        (_a = usedHooksRef === null || usedHooksRef === void 0 ? void 0 : usedHooksRef.current) === null || _a === void 0 ? void 0 : _a.contexts.add(Context.displayName);
    });
    return contextValue;
};
exports.useContextUsageTracker = useContextUsageTracker;
if (typeof global !== "undefined") {
    // @ts-expect-error
    if (global.useContextUsageTracker) {
        module.exports =
            // @ts-expect-error
            global.useContextUsageTracker;
    }
    else {
        // @ts-expect-error
        global.useContextUsageTracker = exports;
    }
}

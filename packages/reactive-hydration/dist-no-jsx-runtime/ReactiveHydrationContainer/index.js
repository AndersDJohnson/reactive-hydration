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
exports.ReactiveHydrationContainer = void 0;
// var jsx_runtime_1 = require("react/jsx-runtime");
var _react_1 = require("_react");
var ReactiveHydrationContainerContext_1 = require("../ReactiveHydrationContainerContext");
var ReactiveHydrationInnardsContext_1 = require("../ReactiveHydrationInnardsContext");
var ReactiveHydrationContainerInner_1 = require("./ReactiveHydrationContainerInner");
var initialUrl = typeof window === "object" ? window.location.href : undefined;
var forceHydrate = typeof window === "object"
    ? window.location.search.includes("forceHydrate")
    : false;
var hasSoftRouted = false;
var reactiveHydrationContainerContextHasNotSoftRouted = {
    isWithinReactiveHydrationContainer: true,
    hasSoftRouted: false,
};
var reactiveHydrationContainerContextHasSoftRouted = {
    isWithinReactiveHydrationContainer: true,
    hasSoftRouted: true,
};
exports.ReactiveHydrationContainer = (0, _react_1.memo)(function (props) {
    var Comp = props.Comp, LazyComp = props.LazyComp, importComponent = props.importComponent, importContext = props.importContext;
    // TODO: Subscribe to location changes.
    var isClientSideSoftRouteAwayFromInitialUrl = 
    // TODO: Will this have ill effect on any rerenders during page transitions?
    typeof window === "object" && window.location.href !== initialUrl;
    if (isClientSideSoftRouteAwayFromInitialUrl) {
        hasSoftRouted = true;
    }
    var reactiveHydrationContainerContext = hasSoftRouted
        ? // TODO: Maybe we want it inactive in future, but for now I like how it keeps serializing resumable state.
            // reactiveHydrationContainerContextInactive
            reactiveHydrationContainerContextHasSoftRouted
        : reactiveHydrationContainerContextHasNotSoftRouted;
    // Client-side render after soft routing - just stand up the whole tree at this point since we don't have SSR HTML to hydrate.
    if (hasSoftRouted || forceHydrate) {
        return (
        // TODO: Do we want this active after soft route?
        (0, global.jsx_runtime_1.jsx)(ReactiveHydrationInnardsContext_1.ReactiveHydrationInnardsContext.Provider, __assign({ value: ReactiveHydrationInnardsContext_1.reactiveHydrationInnardsContextValue }, { children: (0, global.jsx_runtime_1.jsx)(ReactiveHydrationContainerContext_1.ReactiveHydrationContainerContext.Provider, __assign({ value: reactiveHydrationContainerContext }, { children: (0, global.jsx_runtime_1.jsx)("div", { children: (0, global.jsx_runtime_1.jsx)(ReactiveHydrationInnardsContext_1.ReactiveHydrationInnardsContext.Provider, __assign({ value: undefined }, { children: (0, global.jsx_runtime_1.jsx)(LazyComp, { isReactiveHydrationServerComponent: true }) })) }) })) })));
    }
    // Server-side render.
    if (typeof window !== "object" && Comp) {
        console.log("*** render ReactiveHydrationContainer");
        return ((0, global.jsx_runtime_1.jsx)(ReactiveHydrationInnardsContext_1.ReactiveHydrationInnardsContext.Provider, __assign({ value: ReactiveHydrationInnardsContext_1.reactiveHydrationInnardsContextValue }, { children: (0, global.jsx_runtime_1.jsx)(ReactiveHydrationContainerContext_1.ReactiveHydrationContainerContext.Provider, __assign({ value: reactiveHydrationContainerContext }, { children: (0, global.jsx_runtime_1.jsx)("div", { children: (0, global.jsx_runtime_1.jsx)(ReactiveHydrationInnardsContext_1.ReactiveHydrationInnardsContext.Provider, __assign({ value: undefined }, { children: (0, global.jsx_runtime_1.jsx)(Comp, { isReactiveHydrationServerComponent: true }) })) }) })) })));
    }
    return ((0, global.jsx_runtime_1.jsx)(ReactiveHydrationInnardsContext_1.ReactiveHydrationInnardsContext.Provider, __assign({ value: ReactiveHydrationInnardsContext_1.reactiveHydrationInnardsContextValue }, { children: (0, global.jsx_runtime_1.jsx)(ReactiveHydrationContainerContext_1.ReactiveHydrationContainerContext.Provider, __assign({ value: reactiveHydrationContainerContext }, { children: (0, global.jsx_runtime_1.jsx)(ReactiveHydrationContainerInner_1.ReactiveHydrationContainerInner, { importComponent: importComponent, importContext: importContext }) })) })));
}, 
// Never re-render only due to parent re-renders.
function () { return true; });
exports.ReactiveHydrationContainer.displayName = "ReactiveHydrationContainer";
// @ts-expect-error
exports.ReactiveHydrationContainer.reactiveHydrateSkip = true;

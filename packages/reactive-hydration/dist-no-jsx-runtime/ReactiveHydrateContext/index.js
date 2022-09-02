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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveHydrateContextProvider = exports.ReactiveHydrateContext = void 0;
// var jsx_runtime_1 = require("react/jsx-runtime");
var _react_1 = require("_react");
var react_actual_1 = require("../react-actual");
exports.ReactiveHydrateContext = (0, _react_1.createContext)({
    parentComponentPath: [],
});
exports.ReactiveHydrateContext.displayName = "ReactiveHydrateContext";
var ReactiveHydrateContextProvider = function (props) {
    var children = props.children, reactiveHydratingId = props.reactiveHydratingId, reactiveHydratePortalStateProp = props.reactiveHydratePortalState, usedHooksRef = props.usedHooksRef;
    var _a = __read((0, react_actual_1.useState)(function () { return new Map(); }), 1), registry = _a[0];
    var reactiveHydratePortalStateContext = (0, react_actual_1.useContext)(exports.ReactiveHydrateContext).reactiveHydratePortalState;
    var reactiveHydratePortalState = reactiveHydratePortalStateProp !== null && reactiveHydratePortalStateProp !== void 0 ? reactiveHydratePortalStateProp : reactiveHydratePortalStateContext;
    var registerComponentPath = (0, _react_1.useCallback)(function () {
        var currentIndex = registry.get(name);
        var newIndex = (currentIndex !== null && currentIndex !== void 0 ? currentIndex : -1) + 1;
        registry.set(name, newIndex);
        return newIndex;
    }, [registry]);
    var unregisterComponentPath = (0, _react_1.useCallback)(function (name) {
        var currentIndex = registry.get(name);
        registry.set(name, currentIndex - 1);
    }, [registry]);
    var reactiveHydrationComponentPathContextValue = (0, _react_1.useMemo)(function () { return ({
        reactiveHydratingId: reactiveHydratingId,
        reactiveHydratePortalState: reactiveHydratePortalState,
        parentComponentPath: [],
        registerComponentPath: registerComponentPath,
        unregisterComponentPath: unregisterComponentPath,
        usedHooksRef: usedHooksRef,
    }); }, [
        reactiveHydratingId,
        reactiveHydratePortalState,
        registerComponentPath,
        unregisterComponentPath,
        usedHooksRef,
    ]);
    return ((0, global.jsx_runtime_1.jsx)(exports.ReactiveHydrateContext.Provider, __assign({ value: reactiveHydrationComponentPathContextValue }, { children: children })));
};
exports.ReactiveHydrateContextProvider = ReactiveHydrateContextProvider;
if (typeof global !== "undefined") {
    // @ts-expect-error
    if (global.ReactiveHydrateContext) {
        module.exports =
            // @ts-expect-error
            global.ReactiveHydrateContext;
    }
    else {
        // @ts-expect-error
        global.ReactiveHydrateContext = exports;
    }
}
// // @ts-expect-error For debugging only.
// ReactiveHydrateContext.id = Math.random();
exports.ReactiveHydrateContextProvider.reactiveHydrateSkip = true;

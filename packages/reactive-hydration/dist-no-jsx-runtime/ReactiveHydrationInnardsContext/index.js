"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactiveHydrationInnardsContextValue = exports.ReactiveHydrationInnardsContext = void 0;
var _react_1 = require("_react");
// TODO: Is this still needed?
exports.ReactiveHydrationInnardsContext = (0, _react_1.createContext)(undefined);
exports.ReactiveHydrationInnardsContext.displayName = "ReactiveHydrationInnardsContext";
exports.reactiveHydrationInnardsContextValue = {
    isInReactiveHydrationInnards: true,
};

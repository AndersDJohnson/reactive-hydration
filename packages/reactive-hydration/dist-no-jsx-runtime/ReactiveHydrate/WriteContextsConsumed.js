"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteContextsConsumed = void 0;
// var jsx_runtime_1 = require("react/jsx-runtime");
var react_actual_1 = require("../react-actual");
var ReactiveHydrateContext_1 = require("../ReactiveHydrateContext");
var WriteContextsConsumed = function () {
    var _a;
    var usedHooksRef = (0, react_actual_1.useContext)(ReactiveHydrateContext_1.ReactiveHydrateContext).usedHooksRef;
    var setValues = (_a = usedHooksRef === null || usedHooksRef === void 0 ? void 0 : usedHooksRef.current) === null || _a === void 0 ? void 0 : _a.contexts.values();
    var contexts = setValues ? __spreadArray([], __read(setValues), false) : undefined;
    if (!(contexts === null || contexts === void 0 ? void 0 : contexts.length)) {
        return null;
    }
    return (0, global.jsx_runtime_1.jsx)("div", { "data-contexts": contexts.join(",") });
};
exports.WriteContextsConsumed = WriteContextsConsumed;

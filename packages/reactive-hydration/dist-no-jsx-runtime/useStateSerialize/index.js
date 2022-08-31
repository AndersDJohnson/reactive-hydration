"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.useStateSerialize = void 0;
var _react_1 = __importStar(require("_react"));
var react_actual_1 = require("../react-actual");
var SerializedStateContext_1 = require("../SerializedStateContext");
console.log("*** react reactive-hydration useStateSerialize React.id", 
// @ts-expect-error
_react_1.default.id);
var useStateSerialize = function (init) {
    var _a, _b;
    var _c = (_a = (0, react_actual_1.useContext)(SerializedStateContext_1.SerializedStateContext)) !== null && _a !== void 0 ? _a : {}, serializableState = _c.serializableState, setSerializableState = _c.setSerializableState, reactiveHydrateState = _c.reactiveHydrateState;
    console.log("*** useStateSerialize serializableState", serializableState);
    // TODO: For better performance, consider an optional optimization to no longer serialize the state
    // after the entire tree has been hydrated (walking up ancestor components to root).
    var ref = (0, _react_1.useRef)((_b = serializableState === null || serializableState === void 0 ? void 0 : serializableState.length) !== null && _b !== void 0 ? _b : 
    // In practice this fallback will never happen.
    0);
    var stateIndex = ref.current;
    // TODO: Instead of relying on state index, which could break with hydration mismatches,
    // consider generating a unique state ID for each `useState` at compile-time
    // and then looking up its value based on that ID and the component path (to account for multiple instances).
    var initOverride = reactiveHydrateState === null || reactiveHydrateState === void 0 ? void 0 : reactiveHydrateState[stateIndex];
    var _d = __read((0, react_actual_1.useState)(function () {
        return initOverride !== null && initOverride !== void 0 ? initOverride : (typeof init === "function"
            ? // @ts-expect-error Not sure why it can't infer this type.
                init()
            : init);
    }), 2), state = _d[0], setState = _d[1];
    var setStateAndSerializedState = (0, _react_1.useCallback)(function (value) {
        setState(function (currentState) {
            var actualValue = typeof value === "function" ? value(currentState) : value;
            setTimeout(function () {
                setSerializableState === null || setSerializableState === void 0 ? void 0 : setSerializableState(function (previousStates) {
                    console.log("*** useStateSerialize setSerializableState", stateIndex, value, previousStates);
                    return stateIndex == null
                        ? previousStates
                        : !previousStates || stateIndex === 0
                            ? [actualValue]
                            : __spreadArray([], __read(previousStates), false).splice(stateIndex, 0, actualValue);
                });
            });
            return actualValue;
        });
    }, [setSerializableState, stateIndex]);
    return [state, setStateAndSerializedState];
};
exports.useStateSerialize = useStateSerialize;
if (typeof global !== "undefined") {
    // @ts-expect-error
    if (global.useStateSerialize) {
        module.exports =
            // @ts-expect-error
            global.useStateSerialize;
    }
    else {
        // @ts-expect-error
        global.useStateSerialize = exports;
    }
}

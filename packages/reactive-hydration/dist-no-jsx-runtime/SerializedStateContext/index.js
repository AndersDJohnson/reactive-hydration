"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedStateContext = void 0;
var _react_1 = require("_react");
exports.SerializedStateContext = (0, _react_1.createContext)(undefined);
exports.SerializedStateContext.displayName = "SerializedStateContext";
if (typeof global !== "undefined") {
    // @ts-expect-error
    if (global.SerializedStateContext) {
        module.exports =
            // @ts-expect-error
            global.SerializedStateContext;
    }
    else {
        // @ts-expect-error
        global.SerializedStateContext = exports;
    }
}

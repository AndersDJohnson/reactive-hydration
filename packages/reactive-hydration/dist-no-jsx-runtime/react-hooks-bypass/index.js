"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useState = void 0;
var _react_1 = require("_react");
var useState = function (init) {
    return (0, _react_1.useState)(init, 
    // @ts-expect-error The bypass argument is checked in our `jsx-runtime` monkeypatches.
    true);
};
exports.useState = useState;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegisteredState = exports.registerState = void 0;
var _registry = new Map();
var registerState = function (key, state, init) {
    var stateWithKey = state;
    stateWithKey.key = key;
    stateWithKey.init = init;
    _registry.set(key, stateWithKey);
    return stateWithKey;
};
exports.registerState = registerState;
var getRegisteredState = function (key) { return _registry.get(key); };
exports.getRegisteredState = getRegisteredState;

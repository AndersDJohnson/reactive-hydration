"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContextWithDefaultValue = void 0;
var _react_1 = require("_react");
var contextProviderSerialized_1 = require("../contextProviderSerialized");
function createContextWithDefaultValue(displayName, defaultValue, DefaultProvider) {
    var RawContext = (0, _react_1.createContext)(defaultValue, 
    // @ts-expect-error Pass `displayName` to monkeypatch.
    displayName);
    RawContext.displayName = displayName;
    RawContext.defaultValue = defaultValue;
    // @ts-expect-error We know this isn't a native Provider, but a wrapper - but consumers should mostly use it without knowing the difference.
    RawContext.Provider = (0, contextProviderSerialized_1.contextProviderSerialized)(RawContext);
    RawContext.DefaultProvider = DefaultProvider;
    DefaultProvider.displayName = "DefaultProvider";
    return RawContext;
}
exports.createContextWithDefaultValue = createContextWithDefaultValue;

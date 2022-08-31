"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeContextDefaultProviderWrapper = void 0;

var _react_1 = require("_react");
function makeContextDefaultProviderWrapper(
  id,
  Provider,
  serializedValue,
  setContextValue
) {
  var ContextDefaultProviderWrapper = function (props) {
    var children = props.children,
      value = props.value;
    (0, _react_1.useEffect)(
      function () {
        setContextValue(__assign(__assign({}, serializedValue), value));
      },
      [value]
    );
    return (0, global.jsx_runtime_1.jsx)(
      Provider,
      __assign({ id: id, value: value }, { children: children })
    );
  };
  ContextDefaultProviderWrapper.displayName = "ContextDefaultProviderWrapper";
  return ContextDefaultProviderWrapper;
}
exports.makeContextDefaultProviderWrapper = makeContextDefaultProviderWrapper;

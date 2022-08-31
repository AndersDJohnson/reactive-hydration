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
exports.contextProviderSerialized = void 0;

var _react_1 = require("_react");
var react_actual_1 = require("../react-actual");
var ReactiveHydrationContainerContext_1 = require("../ReactiveHydrationContainerContext");
var forceHydrate =
  typeof window === "object"
    ? window.location.search.includes("forceHydrate")
    : false;
var idByValueMap = new WeakMap();
function contextProviderSerialized(context) {
  var Provider = context.Provider,
    displayName = context.displayName;
  var ContextProviderSerialized = function (props) {
    var _a;
    var children = props.children,
      value = props.value,
      idProp = props.id;
    var hasSoftRouted = (0, react_actual_1.useContext)(
      ReactiveHydrationContainerContext_1.ReactiveHydrationContainerContext
    ).hasSoftRouted;
    var serializedValue = (0, _react_1.useMemo)(
      function () {
        return JSON.stringify(value);
      },
      [value]
    );
    var usedId = (0, _react_1.useId)();
    if (typeof window === "object" && !hasSoftRouted && !forceHydrate) {
      return (0, global.jsx_runtime_1.jsx)(
        Provider,
        __assign({ value: value }, { children: children })
      );
    }
    var idFromMap = idByValueMap.get(value);
    if (!idFromMap) {
      idFromMap = Math.random().toString();
      try {
        idByValueMap.set(value, idFromMap);
      } catch (error) {
        console.error("*** WeakMap error for value", value, error);
      }
    }
    var id =
      // This comes on initial client hydration on hard route.
      (_a =
        idProp !== null && idProp !== void 0
          ? idProp
          : // This is used on SSR to give a shared ID between shared source values, so updates are synchronized, just as they would likely be on the client.
            // TODO: We don't really want to do this in case of value coming from a global constant, rather than memoized `useState`...
            idFromMap) !== null && _a !== void 0
        ? _a
        : // Fallback to a randomly generated unique ID for this context instance.
          usedId;
    return (0, global.jsx_runtime_1.jsx)(
      "div",
      __assign(
        {
          "data-context-id": id,
          "data-context-name": displayName,
          "data-context-value": serializedValue,
        },
        {
          children: (0, global.jsx_runtime_1.jsx)(
            Provider,
            __assign({ value: value }, { children: children })
          ),
        }
      )
    );
  };
  ContextProviderSerialized.displayName = "ContextProviderSerialized(".concat(
    displayName,
    ")"
  );
  return ContextProviderSerialized;
}
exports.contextProviderSerialized = contextProviderSerialized;

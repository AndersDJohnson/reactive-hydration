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
exports.ContextPortalTreeRenderer = void 0;

var _react_1 = require("_react");
var ReactiveHydrationInnardsContext_1 = require("../ReactiveHydrationInnardsContext");
var ContextPortalTreeRenderer = function (props) {
  var contextPortalTreeEntry = props.contextPortalTreeEntry;
  var _a =
      contextPortalTreeEntry !== null && contextPortalTreeEntry !== void 0
        ? contextPortalTreeEntry
        : {},
    ContextWrapper = _a.ContextWrapper,
    childPortalTreeEntries = _a.childPortalTreeEntries,
    leafPortals = _a.leafPortals;
  if (
    leafPortals === null || leafPortals === void 0 ? void 0 : leafPortals.length
  ) {
    var leafPortalsWithKeys = leafPortals.map(function (leafPortal) {
      return (0,
      global.jsx_runtime_1
        .jsx)(_react_1.Fragment, { children: leafPortal.portal }, leafPortal.key);
    });
    if (ContextWrapper) {
      return (0, global.jsx_runtime_1.jsx)(ContextWrapper, {
        children: (0, global.jsx_runtime_1.jsx)(
          ReactiveHydrationInnardsContext_1.ReactiveHydrationInnardsContext
            .Provider,
          __assign({ value: undefined }, { children: leafPortalsWithKeys })
        ),
      });
    }
    return (0, global.jsx_runtime_1.jsx)(
      ReactiveHydrationInnardsContext_1.ReactiveHydrationInnardsContext
        .Provider,
      __assign({ value: undefined }, { children: leafPortalsWithKeys })
    );
  }
  if (!ContextWrapper) return null;
  return (0, global.jsx_runtime_1.jsx)(ContextWrapper, {
    children: childPortalTreeEntries.map(function (childPortalTreeEntry) {
      return (0,
      global.jsx_runtime_1
        .jsx)(exports.ContextPortalTreeRenderer, { contextPortalTreeEntry: childPortalTreeEntry }, childPortalTreeEntry.key);
    }),
  });
};
exports.ContextPortalTreeRenderer = ContextPortalTreeRenderer;
exports.ContextPortalTreeRenderer.displayName = "ContextPortalTreeRenderer";

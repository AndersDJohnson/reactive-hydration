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
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactiveHydrate = void 0;

var _react_1 = require("_react");
var react_actual_1 = require("../react-actual");
// import hoistNonReactStatics from "hoist-non-react-statics";
var ReactiveHydrateContext_1 = require("../ReactiveHydrateContext");
var SerializedStateContext_1 = require("../SerializedStateContext");
var WriteContextsConsumed_1 = require("./WriteContextsConsumed");
var ReactiveHydrate_1 = require("./ReactiveHydrate");
var ReactiveHydrationInnardsContext_1 = require("../ReactiveHydrationInnardsContext");
/**
 * TODO: This wrapper could perhaps be wrapped around all components by the compiler.
 */
var reactiveHydrate = function (args, Comp) {
  // TODO: memo wrap? if so, fix display name
  var ReactiveHydrateWrapper = function (props) {
    var _a;
    var name = args.name,
      states = args.states;
    var reactiveHydratePortalStateProp = props.reactiveHydratePortalState,
      reactiveHydrateIdProp = props.reactiveHydrateId;
    // TODO: If these IDs isn't stable enough, we could just resolve the DOM children at runtime that aren't nested inside a deeper client component.
    var reactiveHydrateIdNew = (0, _react_1.useId)();
    var reactiveHydrateId =
      reactiveHydrateIdProp !== null && reactiveHydrateIdProp !== void 0
        ? reactiveHydrateIdProp
        : reactiveHydrateIdNew;
    var _b =
        (_a = (0, react_actual_1.useContext)(
          ReactiveHydrateContext_1.ReactiveHydrateContext
        )) !== null && _a !== void 0
          ? _a
          : {},
      reactiveHydratePortalStateContext = _b.reactiveHydratePortalState,
      parentComponentPath = _b.parentComponentPath,
      registerComponentPath = _b.registerComponentPath,
      unregisterComponentPath = _b.unregisterComponentPath;
    var reactiveHydratePortalState =
      reactiveHydratePortalStateProp !== null &&
      reactiveHydratePortalStateProp !== void 0
        ? reactiveHydratePortalStateProp
        : reactiveHydratePortalStateContext;
    var _c = __read((0, react_actual_1.useState)(0), 2),
      componentIndex = _c[0],
      setComponentIndex = _c[1];
    (0, _react_1.useEffect)(
      function () {
        var _a;
        setComponentIndex(
          (_a =
            registerComponentPath === null || registerComponentPath === void 0
              ? void 0
              : registerComponentPath(name)) !== null && _a !== void 0
            ? _a
            : 0
        );
        return function () {
          return unregisterComponentPath === null ||
            unregisterComponentPath === void 0
            ? void 0
            : unregisterComponentPath(name);
        };
      },
      [registerComponentPath, unregisterComponentPath, name]
    );
    var componentPath = (0, _react_1.useMemo)(
      function () {
        return __spreadArray(
          __spreadArray([], __read(parentComponentPath), false),
          [name, componentIndex],
          false
        );
      },
      [name, parentComponentPath, componentIndex]
    );
    var _d = __read(
        (0, react_actual_1.useState)(function () {
          if (!reactiveHydratePortalState) return;
          var portalKey = componentPath.join(".");
          var state = reactiveHydratePortalState[portalKey];
          return state;
        }),
        1
      ),
      reactiveHydrateState = _d[0];
    var _e = __read(
        (0, react_actual_1.useState)(function () {
          return [];
        }),
        2
      ),
      serializableState = _e[0],
      setSerializableState = _e[1];
    var serializeStateContextValue = (0, _react_1.useMemo)(
      function () {
        return {
          serializableState: serializableState,
          setSerializableState: setSerializableState,
          reactiveHydrateState: reactiveHydrateState,
        };
      },
      [serializableState, setSerializableState, reactiveHydrateState]
    );
    var serializedState = (0, _react_1.useMemo)(
      function () {
        return (
          serializableState === null || serializableState === void 0
            ? void 0
            : serializableState.length
        )
          ? JSON.stringify(serializableState)
          : undefined;
      },
      [serializableState]
    );
    var usedHooksRef = (0, _react_1.useRef)({
      contexts: new Set(),
    });
    return (0, global.jsx_runtime_1.jsx)(
      ReactiveHydrationInnardsContext_1.ReactiveHydrationInnardsContext
        .Provider,
      __assign(
        {
          value:
            ReactiveHydrationInnardsContext_1.reactiveHydrationInnardsContextValue,
        },
        {
          children: (0, global.jsx_runtime_1.jsx)(
            ReactiveHydrateContext_1.ReactiveHydrateContextProvider,
            __assign(
              {
                reactiveHydratingId: reactiveHydrateIdProp,
                reactiveHydratePortalState: reactiveHydratePortalState,
                usedHooksRef: usedHooksRef,
              },
              {
                children: (0, global.jsx_runtime_1.jsxs)(
                  ReactiveHydrate_1.ReactiveHydrate,
                  __assign(
                    { id: reactiveHydrateId, name: name, states: states },
                    {
                      children: [
                        (0, global.jsx_runtime_1.jsxs)(
                          SerializedStateContext_1.SerializedStateContext
                            .Provider,
                          __assign(
                            { value: serializeStateContextValue },
                            {
                              children: [
                                serializedState
                                  ? (0, global.jsx_runtime_1.jsx)("div", {
                                      "data-id": reactiveHydrateId,
                                      "data-state": serializedState,
                                    })
                                  : null,
                                (0, global.jsx_runtime_1.jsx)(
                                  ReactiveHydrationInnardsContext_1
                                    .ReactiveHydrationInnardsContext.Provider,
                                  __assign(
                                    { value: undefined },
                                    {
                                      children: (0, global.jsx_runtime_1.jsx)(
                                        Comp,
                                        __assign({}, props)
                                      ),
                                    }
                                  )
                                ),
                              ],
                            }
                          )
                        ),
                        (0, global.jsx_runtime_1.jsx)(
                          WriteContextsConsumed_1.WriteContextsConsumed,
                          {}
                        ),
                      ],
                    }
                  )
                ),
              }
            )
          ),
        }
      )
    );
  };
  // if (!Comp.displayName) {
  //   Comp.displayName = args.name;
  // }
  // TODO: Do we really want/need to hoist these?
  // hoistNonReactStatics(ReactiveHydrateWrapper, Comp);
  ReactiveHydrateWrapper.displayName = "ReactiveHydrateWrapper(".concat(
    Comp.displayName,
    ")"
  );
  return ReactiveHydrateWrapper;
};
exports.reactiveHydrate = reactiveHydrate;

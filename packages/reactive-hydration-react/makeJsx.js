// const React = require("_react");

// const { useContext, useId, useMemo, useState, useCallback, useRef, useEffect } =
//   React;

// const {
//   ReactiveHydrationContainerContext,
// } = require("reactive-hydration/dist-no-jsx-runtime/ReactiveHydrationContainerContext");
// const {
//   ReactiveHydrationInnardsContext,
// } = require("reactive-hydration/dist-no-jsx-runtime/ReactiveHydrationInnardsContext");
// const {
//   ReactiveHydrateContext,
// } = require("reactive-hydration/dist-no-jsx-runtime/ReactiveHydrateContext");
// const {
//   SerializedStateContext,
// } = require("reactive-hydration/dist-no-jsx-runtime/SerializedStateContext");
require("reactive-hydration/dist-no-jsx-runtime/react-actual");
const {
  reactiveHydrate,
} = require("reactive-hydration/dist-no-jsx-runtime/ReactiveHydrate");

const getTypeName = (type) =>
  type.displayName ??
  type.name ??
  type.render?.displayName ??
  type.render?.name;

const RTypes = new WeakMap();

const getType = (Type) => {
  if (RTypes.get(Type)) {
    return RTypes.get(Type);
  }

  const name = getTypeName(Type);

  const { states } = Type;

  const RType = reactiveHydrate(
    {
      name,
      states,
    },
    Type
  );

  RTypes.set(Type, RType);

  return RType;
};

exports.makeJsx = (_label, jsxRuntime) => {
  global.jsx_runtime_1 = jsxRuntime;

  const origJsx =
    jsxRuntime.createElement ?? jsxRuntime.jsxDEV ?? jsxRuntime.jsx;

  return (type, ...args) => {
    if (type._context) {
      // console.log("*** render context", type._context.displayName);
      return origJsx(type, ...args);
    }

    // TODO: Handle memo objects?
    if (typeof type !== "function") {
      return origJsx(type, ...args);
    }

    const Type = type;

    const [props, ...restArgs] = args;

    const { reactiveHydrateSkip, ...restProps } = props ?? {};

    const propsWithoutreactiveHydrateSkip = props ? restProps : props;

    if (props?.reactiveHydrateSkip) {
      return origJsx(type, propsWithoutreactiveHydrateSkip, ...restArgs);
    }

    const name = getTypeName(Type);

    // console.log("*** jsxDEV name", name);

    if (!name) {
      return origJsx(Type, ...args);
    }

    if (type.reactiveHydrateSkip) {
      return origJsx(Type, ...args);
    }

    console.log("*** jsx name", name);

    // return origJsx(Type, ...args);

    // TODO: Memoize?
    const ReactiveHydrateType = getType(Type);

    return origJsx(ReactiveHydrateType, ...args);
  };
};

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

  // const WriteContextsConsumed = () => {
  //   const { usedHooksRef } = useContext(ReactiveHydrateContext) ?? {};

  //   const setValues = usedHooksRef?.current?.contexts.values();

  //   const contexts = setValues ? [...setValues] : undefined;

  //   if (!contexts?.length) {
  //     return null;
  //   }

  //   return origJsx("div", {
  //     "data-contexts": contexts.join(","),
  //   });
  // };

  // const ReactiveHydrateType = (props) => {
  //   // console.log(`*** render ReactiveHydrateType(${name})`);

  //   const { Type, childArgs } = props;

  //   const [childProps] = childArgs;
  //   const {
  //     reactiveHydrateId,
  //     reactiveHydratePortalState: reactiveHydratePortalStateProp,
  //   } = childProps ?? {};

  //   const { states } = Type;

  //   const name = getTypeName(Type);

  //   const [registry] = useState(() => new Map());

  //   const {
  //     reactiveHydratePortalState: reactiveHydratePortalStateContext,
  //     parentComponentPath,
  //     registerComponentPath: registerComponentPathFromContext,
  //     unregisterComponentPath: unregisterComponentPathFromContext,
  //   } = useContext(ReactiveHydrateContext) ?? {};

  //   const reactiveHydratePortalState =
  //     reactiveHydratePortalStateProp ?? reactiveHydratePortalStateContext;

  //   const usedHooksRef = useRef();

  //   const registerComponentPath = useCallback(() => {
  //     const currentIndex = registry.get(name);

  //     const newIndex = (currentIndex ?? -1) + 1;

  //     registry.set(name, newIndex);

  //     return newIndex;
  //   }, [registry, name]);

  //   const unregisterComponentPath = useCallback(
  //     (name) => {
  //       const currentIndex = registry.get(name);

  //       registry.set(name, currentIndex - 1);
  //     },
  //     [registry]
  //   );

  //   const reactiveHydrationComponentPathContextValue = useMemo(
  //     () => ({
  //       reactiveHydrateId,
  //       reactiveHydratePortalState,
  //       parentComponentPath: [],
  //       registerComponentPath,
  //       unregisterComponentPath,
  //       usedHooksRef,
  //     }),
  //     [
  //       reactiveHydrateId,
  //       reactiveHydratePortalState,
  //       registerComponentPath,
  //       unregisterComponentPath,
  //       usedHooksRef,
  //     ]
  //   );

  //   const id = useId();

  //   const { isWithinReactiveHydrationContainer } =
  //     useContext(ReactiveHydrationContainerContext) ?? {};

  //   const { isInReactiveHydrationInnards } =
  //     useContext(ReactiveHydrationInnardsContext) ?? {};

  //   // const { reactiveHydrateId: reactiveHydrateIdFromContext } = useContext(
  //   //   ReactiveHydrateContext
  //   // );

  //   const [componentIndex, setComponentIndex] = useState(0);

  //   useEffect(() => {
  //     setComponentIndex(registerComponentPathFromContext?.(name) ?? 0);

  //     return () => unregisterComponentPathFromContext?.(name);
  //   }, [
  //     registerComponentPathFromContext,
  //     unregisterComponentPathFromContext,
  //     name,
  //   ]);

  //   const componentPath = useMemo(
  //     () => [...parentComponentPath, name, componentIndex],
  //     [name, parentComponentPath, componentIndex]
  //   );

  //   const [reactiveHydrateState] = useState(() => {
  //     if (!reactiveHydratePortalState) return;

  //     const portalKey = componentPath.join(".");

  //     const state = reactiveHydratePortalState[portalKey];

  //     return state;
  //   });

  //   const [serializableState, setSerializableState] = useState(() => []);

  //   const serializeStateContextValue = useMemo(
  //     () => ({
  //       serializableState,
  //       setSerializableState,
  //       reactiveHydrateState,
  //     }),
  //     [serializableState, setSerializableState, reactiveHydrateState]
  //   );

  //   const serializedState = useMemo(
  //     () =>
  //       serializableState?.length
  //         ? JSON.stringify(serializableState)
  //         : undefined,
  //     [serializableState]
  //   );

  //   const isHydratingSelf = Boolean(reactiveHydrateId);

  //   if (!isWithinReactiveHydrationContainer || isInReactiveHydrationInnards) {
  //     return origJsx(Type, ...childArgs);
  //   }

  //   console.log(
  //     `*** ReactiveHydrateType(${name}) isWithinReactiveHydrationContainer`,
  //     isWithinReactiveHydrationContainer
  //   );

  //   const children = origJsx(ReactiveHydrateContext.Provider, {
  //     value: reactiveHydrationComponentPathContextValue,
  //     children: [
  //       origJsx(SerializedStateContext.Provider, {
  //         value: serializeStateContextValue,
  //         children: [
  //           serializedState
  //             ? origJsx("div", {
  //                 "data-id": reactiveHydrateId,
  //                 "data-state": serializedState,
  //               })
  //             : undefined,

  //           origJsx(Type, ...childArgs),
  //         ].filter(Boolean),
  //       }),

  //       origJsx(WriteContextsConsumed, {}),
  //     ],
  //   });

  //   console.log("*** isHydratingSelf", name, isHydratingSelf);

  //   // TODO: forceHydrate?
  //   if (typeof window !== "object" || !isHydratingSelf) {
  //     return origJsx("div", {
  //       "data-component": name,
  //       "data-states": states,
  //       // This ID has to be here since it's the only one stable between server render and post client hydration.
  //       "data-id": id,
  //       // For soft route loading on client-side, check for `window`.
  //       "data-loaded": typeof window === "object",
  //       children,
  //     });
  //   }

  //   return children;
  // };

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

    console.log("*** Type", Type);
    console.log("*** ReactiveHydrateType", ReactiveHydrateType);

    return origJsx(ReactiveHydrateType, ...args);
  };
};

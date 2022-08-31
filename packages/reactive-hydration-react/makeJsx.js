const React = require("_react");

const { useContext, useId, useMemo, useState, useCallback } = React;

const {
  ReactiveHydrationContainerContext,
} = require("reactive-hydration/dist/ReactiveHydrationContainerContext");
const {
  ReactiveHydrationInnardsContext,
} = require("reactive-hydration/dist/ReactiveHydrationInnardsContext");
const {
  ReactiveHydrateContext,
} = require("reactive-hydration/dist/ReactiveHydrateContext");

console.log("*** reactive-hydration-react/jsx-dev-runtime _react id", React.id);

const getTypeName = (type) =>
  type.displayName ??
  type.name ??
  type.render?.displayName ??
  type.render?.name;

exports.makeJsx = (_label, origJsx) => {
  const ReactiveHydrateType = (props) => {
    // console.log(`*** render ReactiveHydrateType(${name})`);

    const { Type, childArgs, usedHooksRef } = props;

    const [childProps] = childArgs;
    const {
      reactiveHydrateId,
      reactiveHydratePortalState: reactiveHydratePortalStateProp,
    } = childProps ?? {};

    const { states } = Type;

    const name = getTypeName(Type);

    const [registry] = useState(() => new Map());

    const { reactiveHydratePortalState: reactiveHydratePortalStateContext } =
      useContext(ReactiveHydrateContext);

    const reactiveHydratePortalState =
      reactiveHydratePortalStateProp ?? reactiveHydratePortalStateContext;

    const registerComponentPath = useCallback(() => {
      const currentIndex = registry.get(name);

      const newIndex = (currentIndex ?? -1) + 1;

      registry.set(name, newIndex);

      return newIndex;
    }, [registry, name]);

    const unregisterComponentPath = useCallback(
      (name) => {
        const currentIndex = registry.get(name);

        registry.set(name, currentIndex - 1);
      },
      [registry]
    );

    const reactiveHydrationComponentPathContextValue = useMemo(
      () => ({
        reactiveHydrateId,
        reactiveHydratePortalState,
        parentComponentPath: [],
        registerComponentPath,
        unregisterComponentPath,
        usedHooksRef,
      }),
      [
        reactiveHydrateId,
        reactiveHydratePortalState,
        registerComponentPath,
        unregisterComponentPath,
        usedHooksRef,
      ]
    );

    const id = useId();

    const { isWithinReactiveHydrationContainer } =
      useContext(ReactiveHydrationContainerContext) ?? {};

    const { isInReactiveHydrationInnards } =
      useContext(ReactiveHydrationInnardsContext) ?? {};

    // const { reactiveHydrateId: reactiveHydrateIdFromContext } = useContext(
    //   ReactiveHydrateContext
    // );

    const isHydratingSelf = Boolean(reactiveHydrateId);

    if (!isWithinReactiveHydrationContainer || isInReactiveHydrationInnards) {
      return origJsx(Type, ...childArgs);
    }

    console.log(
      `*** ReactiveHydrateType(${name}) isWithinReactiveHydrationContainer`,
      isWithinReactiveHydrationContainer
    );

    const children = origJsx(ReactiveHydrateContext.Provider, {
      value: reactiveHydrationComponentPathContextValue,
      children: origJsx(Type, ...childArgs),
    });

    console.log("*** isHydratingSelf", name, isHydratingSelf);

    // TODO: forceHydrate?
    if (typeof window !== "object" || !isHydratingSelf) {
      return origJsx("div", {
        "data-component": name,
        "data-states": states,
        // This ID has to be here since it's the only one stable between server render and post client hydration.
        "data-id": id,
        // For soft route loading on client-side, check for `window`.
        "data-loaded": typeof window === "object",
        children,
      });
    }

    return children;
  };

  return (type, ...args) => {
    if (type._context) {
      // console.log("*** render context", type._context.displayName);
      return origJsx(type, ...args);
    }

    // TODO: Handle memo objects?
    if (typeof type !== "function") {
      return origJsx(type, ...args);
    }

    const name = getTypeName(type);

    // console.log("*** jsxDEV name", name);

    if (!name) {
      return origJsx(type, ...args);
    }

    if (name.startsWith("ContextProviderSerialized(")) {
      return origJsx(type, ...args);
    }

    const Type = type;

    return origJsx(ReactiveHydrateType, {
      Type,
      childArgs: args,
    });
  };
};

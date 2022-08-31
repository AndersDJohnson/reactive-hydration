const React = require("_react");

const { useContext, useId } = React;

const {
  ReactiveHydrationContainerContext,
} = require("reactive-hydration/dist/ReactiveHydrationContainerContext");
const {
  ReactiveHydrationInnardsContext,
} = require("reactive-hydration/dist/ReactiveHydrationInnardsContext");

console.log("*** reactive-hydration-react/jsx-dev-runtime _react id", React.id);

const getTypeName = (type) =>
  type.displayName ??
  type.name ??
  type.render?.displayName ??
  type.render?.name;

exports.makeJsx = (_label, origJsx) => {
  const ReactiveHydrateType = ({ Type, childArgs }) => {
    // console.log(`*** render ReactiveHydrateType(${name})`);

    const { states } = Type;

    const name = getTypeName(Type);

    const id = useId();

    const { isInReactiveHydrationInnards } =
      useContext(ReactiveHydrationInnardsContext) ?? {};

    const { isWithinReactiveHydrationContainer } =
      useContext(ReactiveHydrationContainerContext) ?? {};

    if (!isWithinReactiveHydrationContainer || isInReactiveHydrationInnards) {
      return origJsx(Type, ...childArgs);
    }

    console.log(
      `*** ReactiveHydrateType(${name}) isWithinReactiveHydrationContainer`,
      isWithinReactiveHydrationContainer
    );

    const children = origJsx(Type, ...childArgs);

    // TODO: isHydratingSelf?
    // TODO: forceHydrate?
    if (typeof window !== "object") {
      return origJsx("div", {
        "data-component": name,
        "data-states": states,
        // This ID has to be here since it's the only one stable between server render and post client hydration.
        "data-id": id,
        // For soft route loading on client-side, check for `window`.
        "data-loaded": false,
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

    const Type = type;

    // ReactiveHydrateType = reactiveHydrate(
    //   {
    //     name,
    //     states,
    //   },
    //   Type
    // );

    return origJsx(ReactiveHydrateType, {
      Type,
      childArgs: args,
    });
  };
};

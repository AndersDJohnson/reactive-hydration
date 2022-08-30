const React = require("_react");

const { useContext, useId } = React;

const {
  ReactiveHydrationContainerContext,
} = require("reactive-hydration/dist/ReactiveHydrationContainerContext");

console.log("*** reactive-hydration-react/jsx-dev-runtime _react id", React.id);

const reactiveHydrateRegistry = new Map();

exports.makeJsx =
  (_label, origJsx) =>
  (type, ...args) => {
    if (type._context) {
      // console.log("*** render context", type._context.displayName);
      return origJsx(type, ...args);
    }

    // TODO: Handle memo objects?
    if (typeof type !== "function") {
      return origJsx(type, ...args);
    }

    const name =
      type.displayName ??
      type.name ??
      type.render?.displayName ??
      type.render?.name;

    // console.log("*** jsxDEV name", name);

    if (!name) {
      return origJsx(type, ...args);
    }

    const Type = type;

    const { states } = Type;

    let ReactiveHydrateType = reactiveHydrateRegistry.get(name);

    if (!ReactiveHydrateType) {
      // ReactiveHydrateType = reactiveHydrate(
      //   {
      //     name,
      //     states,
      //   },
      //   Type
      // );

      ReactiveHydrateType = ({ childArgs }) => {
        // console.log(`*** render ReactiveHydrateType(${name})`);

        const id = useId();

        const { isWithinReactiveHydrationContainer } = useContext(
          ReactiveHydrationContainerContext
        );

        if (!isWithinReactiveHydrationContainer) {
          return origJsx(Type, ...childArgs);
        }

        console.log(
          `*** ReactiveHydrateType(${name}) isWithinReactiveHydrationContainer`,
          isWithinReactiveHydrationContainer
        );

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
            children: origJsx(Type, ...childArgs),
          });
        }

        return origJsx(Type, ...childArgs);
      };

      reactiveHydrateRegistry.set(name, ReactiveHydrateType);
    }

    return origJsx(ReactiveHydrateType, {
      childArgs: args,
    });
  };

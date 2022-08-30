const React = require("_react");

const { useContext } = React;

// const {
//   SerializedStateContext,
// } = require("reactive-hydration/dist/SerializedStateContext");

// const { reactiveHydrate } = require("reactive-hydration/dist/ReactiveHydrate");
const {
  ReactiveHydrationContainerContext,
} = require("reactive-hydration/dist/ReactiveHydrationContainerContext");
// const {
//   reactiveHydrate,
//   // ReactiveHydrationContainerContext,
//   // ReactiveHydrationInnardsContext,
// } =
//   // global.ReactiveHydrationSingleton ??

console.log("*** reactive-hydration-react/jsx-dev-runtime _react id", React.id);

const reactiveHydrateRegistry = new Map();

exports.makeJsx =
  (_label, origJsx) =>
  (type, ...args) => {
    if (type._context) {
      console.log("*** render context", type._context.displayName);
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

    console.log("*** jsxDEV name", name);

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
        console.log(`*** render ReactiveHydrateType(${name})`);

        const { isWithinReactiveHydrationContainer } = useContext(
          ReactiveHydrationContainerContext
        );

        console.log(
          "*** ReactiveHydrateType isWithinReactiveHydrationContainer",
          isWithinReactiveHydrationContainer
        );

        if (!isWithinReactiveHydrationContainer) {
          return origJsx(Type, ...childArgs);
        }

        // TODO: isHydratingSelf?
        // TODO: forceHydrate?
        if (typeof window !== "object") {
          return origJsx("div", {
            "data-component": name,
            "data-states": states,
            // This ID has to be here since it's the only one stable between server render and post client hydration.
            "data-id": "TODO",
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

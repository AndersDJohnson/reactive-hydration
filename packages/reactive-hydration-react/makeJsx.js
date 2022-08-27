const { useContext } = require("_react");

const {
  reactiveHydrate,
  ReactiveHydrationContainerContext,
  ReactiveHydrationInnardsContext,
} = global.ReactiveHydrationSingleton ?? require("reactive-hydration");

// const { logRender } = require("./log");

exports.makeJsx =
  (_label, origJsx) =>
  (type, props, ...rest) => {
    // logRender("*** render", _label, type);

    // // TODO: Handle memo objects?
    if (typeof type !== "function") {
      return origJsx(type, props, ...rest);
    }

    const name =
      type.displayName ??
      type.name ??
      type.render?.displayName ??
      type.render?.name;

    if (name?.startsWith("ContextProviderSerialized")) {
      return origJsx(type, props, ...rest);
    }

    const Type = type;

    const { states } = Type;

    const ReactiveHydrateType = reactiveHydrate(
      {
        name,
        states,
      },
      Type
    );

    // TODO: forwardRef ?
    const NewType = (p) => {
      const { isReactiveHydrationServerComponent } = p;

      const reactiveHydrationContainerContext = useContext(
        ReactiveHydrationContainerContext
      );

      const { isWithinReactiveHydrationContainer } =
        reactiveHydrationContainerContext;

      const reactiveHydrationInnardsContext =
        useContext(ReactiveHydrationInnardsContext) ?? {};

      const { isInReactiveHydrationInnards } = reactiveHydrationInnardsContext;

      if (
        !isWithinReactiveHydrationContainer ||
        isInReactiveHydrationInnards ||
        isReactiveHydrationServerComponent
      ) {
        // TODO: Should this be `props` or `p`?
        return origJsx(Type, p);
      }

      // TODO: Should this be `props` or `p`?
      return origJsx(ReactiveHydrateType, p);
    };

    NewType.displayName = `ReactiveHydrationCreateElementWrapper(${name})`;

    return origJsx(
      NewType,
      {
        // displayName,
        children: origJsx(Type, props, ...rest),
      },
      ...rest
    );
  };

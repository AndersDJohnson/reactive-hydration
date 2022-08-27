const React = require("_react");
const { useContext } = React;

console.log("*** react reactive-hydration-react makeJsx", React.id);

const {
  reactiveHydrate,
  ReactiveHydrationContainerContext,
  ReactiveHydrationInnardsContext,
} =
  // global.ReactiveHydrationSingleton ??
  require("reactive-hydration");

// const { logRender } = require("./log");

exports.makeJsx = (_label, origJsx) => (type, props) => {
  // logRender("*** render", _label, type);

  // // TODO: Handle memo objects?
  if (typeof type !== "function") {
    return origJsx(type, props);
  }

  const name =
    type.displayName ??
    type.name ??
    type.render?.displayName ??
    type.render?.name;

  if (name?.startsWith("ContextProviderSerialized")) {
    return origJsx(type, props);
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
      ReactiveHydrationContainerContext,
      true
    );

    const { isWithinReactiveHydrationContainer } =
      reactiveHydrationContainerContext;

    const reactiveHydrationInnardsContext =
      useContext(ReactiveHydrationInnardsContext, true) ?? {};

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

  return origJsx(NewType, {
    // displayName,
    children: origJsx(Type, props),
  });
};

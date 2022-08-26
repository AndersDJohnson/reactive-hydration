const jsxRuntime = require("_react/jsx-runtime");
const { useContext } = require("_react");
// TODO: Circular dep? Update imports in package to `_react`?
const {
  reactiveHydrate,
  ReactiveHydrationContainerContext,
  ReactiveHydrationInnardsContext,
} = require("reactive-hydration");

const origJsx = jsxRuntime.jsx;
const origJsxs = jsxRuntime.jsxs;

jsxRuntime.jsx = (type, props) => {
  console.log("*** jsx", type, props);

  // TODO: Handle memo objects?
  if (typeof type !== "function") {
    return origJsx(type, props);
  }

  const name =
    type.displayName ??
    type.name ??
    type.render?.displayName ??
    type.render?.name;

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
  const NewType = (props) => {
    const { isReactiveHydrationServerComponent } = props;

    const { isWithinReactiveHydrationContainer } = useContext(
      ReactiveHydrationContainerContext
    );

    const { isInReactiveHydrationInnards } =
      useContext(ReactiveHydrationInnardsContext) ?? {};

    console.log("*** NewType for", name, "booleans", {
      isReactiveHydrationServerComponent,
      isWithinReactiveHydrationContainer,
      isInReactiveHydrationInnards,
    });

    if (
      !isWithinReactiveHydrationContainer ||
      isInReactiveHydrationInnards ||
      isReactiveHydrationServerComponent
    ) {
      console.log("*** bypassing ReactiveHydrate wrapper", name);

      return origJsx(Type, props);
    }

    console.log("*** using ReactiveHydrate wrapper", name);

    return origJsx(ReactiveHydrateType, props);
  };

  NewType.displayName = `ReactiveHydrationCreateElementWrapper(${name})`;

  return origJsx(NewType, props);
};

jsxRuntime.jsxs = (type, props) => {
  console.log("*** jsxs", type, props);

  return origJsxs(type, props);
};

module.exports = jsxRuntime;

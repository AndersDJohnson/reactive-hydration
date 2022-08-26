const jsxRuntime = require("_react/jsx-runtime");
const { useContext, useState, createContext } = require("_react");
const {
  reactiveHydrate,
  ReactiveHydrationContainerContext,
  ReactiveHydrationInnardsContext,
} = require("reactive-hydration");

const origJsx = jsxRuntime.jsx;
const origJsxs = jsxRuntime.jsxs;

console.log(
  "*** ReactiveHydrationContainerContext",
  ReactiveHydrationContainerContext
);
console.log(
  "*** ReactiveHydrationInnardsContext",
  ReactiveHydrationInnardsContext
);

jsxRuntime.jsx = (type, props) => {
  console.log("*** jsx", type, props);

  // TODO: Handle memo objects?
  if (typeof type !== "function") {
    return origJsx(type, props);
  }

  console.log("*** type fn", type.toString());

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
  const NewType = (p) => {
    const { isReactiveHydrationServerComponent } = p;

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
      // console.log("*** bypassing ReactiveHydrate wrapper", name);

      // TODO: Should this be `props` or `p`?
      return origJsx(Type, p);
    }

    console.log("*** using ReactiveHydrate wrapper", name);

    // TODO: Should this be `props` or `p`?
    return origJsx(ReactiveHydrateType, p);
  };

  NewType.displayName = `ReactiveHydrationCreateElementWrapper(${name})`;

  return origJsx(NewType, {
    // displayName,
    children: origJsx(Type, props),
  });
};

jsxRuntime.jsxs = (type, props) => {
  console.log("*** jsxs", type, props);

  return origJsxs(type, props);
};

module.exports = jsxRuntime;

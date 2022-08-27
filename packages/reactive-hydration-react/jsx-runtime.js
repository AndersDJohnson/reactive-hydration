const jsxRuntime = require("_react/jsx-runtime");
const { useContext } = require("_react");

// const {
//   reactiveHydrate,
//   ReactiveHydrationContainerContext,
//   ReactiveHydrationInnardsContext,
// } =
//   __webpack_require__("reactive-hydration");

const {
  reactiveHydrate,
  ReactiveHydrationContainerContext,
  ReactiveHydrationInnardsContext,
} = global.ReactiveHydrationSingleton ?? require("reactive-hydration");

const { logRender } = require("./log");

const origJsx = jsxRuntime.jsx;
const origJsxs = jsxRuntime.jsxs;

// console.log(
//   "*** ReactiveHydrationContainerContext",
//   ReactiveHydrationContainerContext
// );
// console.log(
//   "*** ReactiveHydrationInnardsContext",
//   ReactiveHydrationInnardsContext
// );

jsxRuntime.jsx = (type, props, ...rest) => {
  // const {
  //   reactiveHydrate,
  //   ReactiveHydrationContainerContext,
  //   ReactiveHydrationInnardsContext,
  // } =
  //   // require("reactive-hydration");
  //   __webpack_require__("reactive-hydration");

  logRender("*** jsx", type);

  // return origJsx(type, props, ...rest);

  // // TODO: Handle memo objects?
  if (typeof type !== "function") {
    return origJsx(type, props, ...rest);
  }

  // console.log("*** type fn", type.toString());

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

    // console.log("*** NewType for", name, "contexts", {
    //   "ReactiveHydrationContainerContext.id":
    //     // @ts-ignore
    //     ReactiveHydrationContainerContext.id,
    //   reactiveHydrationContainerContext,
    //   reactiveHydrationInnardsContext,
    // });

    // console.log("*** NewType for", name, "booleans", {
    //   isReactiveHydrationServerComponent,
    //   isWithinReactiveHydrationContainer,
    //   isInReactiveHydrationInnards,
    // });

    if (
      !isWithinReactiveHydrationContainer ||
      isInReactiveHydrationInnards ||
      isReactiveHydrationServerComponent
    ) {
      console.log("*** bypassing ReactiveHydrate wrapper", name);

      // TODO: Should this be `props` or `p`?
      return origJsx(Type, p);
    }

    console.log("*** using ReactiveHydrate wrapper", name);

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

jsxRuntime.jsxs = (type, props, ...rest) => {
  logRender("*** jsxs", type);

  return origJsxs(type, props, ...rest);
};

module.exports = jsxRuntime;

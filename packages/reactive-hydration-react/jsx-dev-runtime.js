const jsxDevRuntime = require("_react/jsx-dev-runtime");

const { jsxDEV: origJsxDEV } = jsxDevRuntime;

const React = require("_react");

// const { useContext } = React;

// const {
//   SerializedStateContext,
// } = require("reactive-hydration/dist/SerializedStateContext");

const { reactiveHydrate } = require("reactive-hydration/dist/ReactiveHydrate");
// const {
//   reactiveHydrate,
//   // ReactiveHydrationContainerContext,
//   // ReactiveHydrationInnardsContext,
// } =
//   // global.ReactiveHydrationSingleton ??

console.log("*** reactive-hydration-react/jsx-dev-runtime _react id", React.id);

const reactiveHydrateRegistry = new Map();

const jsxDEV = (type, ...args) => {
  const [props, ...restArgs] = args;

  // TODO: Handle memo objects?
  if (typeof type !== "function") {
    return origJsxDEV(type, ...args);
  }

  const name =
    type.displayName ??
    type.name ??
    type.render?.displayName ??
    type.render?.name;

  const Type = type;

  const { states } = Type;

  let ReactiveHydrateType = reactiveHydrateRegistry.get(name);

  if (!ReactiveHydrateType) {
    ReactiveHydrateType = reactiveHydrate(
      {
        name,
        states,
      },
      Type
    );

    reactiveHydrateRegistry.set(name, ReactiveHydrateType);
  }

  const Wrapper = () => {
    return origJsxDEV(ReactiveHydrateType, {
      children: origJsxDEV(type, ...args),
    });

    // // Works!
    // const serializedStateContext = useContext(SerializedStateContext);
    // console.log(
    //   "*** reactive-hydration-react/jsx-dev-runtime Wrapper serializedStateContext",
    //   serializedStateContext
    // );
    // return origJsxDEV(SerializedStateContext.Provider, {
    //   value: {
    //     serializableState: ["ok"],
    //   },
    //   children: origJsxDEV(type, ...args),
    // });
    // // Works!
    // return origJsxDEV(type, ...args);
  };

  Wrapper.displayName = "Wrapper";

  return origJsxDEV(Wrapper, ...args);
};

jsxDevRuntime.jsxDEV = jsxDEV;

module.exports = jsxDevRuntime;

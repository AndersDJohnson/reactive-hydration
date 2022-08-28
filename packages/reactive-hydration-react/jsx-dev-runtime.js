const jsxDevRuntime = require("_react/jsx-dev-runtime");

const { jsxDEV: origJsxDEV } = jsxDevRuntime;

const React = require("_react");

// const { useContext } = React;

// const {
//   SerializedStateContext,
// } = require("reactive-hydration/dist/SerializedStateContext");

const { reactiveHydrate } = require("reactive-hydration/dist/ReactiveHydrate");
// const {
//   ReactiveHydrationContainerContext,
// } = require("reactive-hydration/dist/ReactiveHydrationContainerContext");
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

  return origJsxDEV(ReactiveHydrateType, ...args);
};

jsxDevRuntime.jsxDEV = jsxDEV;

module.exports = jsxDevRuntime;

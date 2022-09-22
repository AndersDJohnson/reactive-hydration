require("reactive-hydration/dist-no-jsx-runtime/react-actual");
const {
  reactiveHydrate,
} = require("reactive-hydration/dist-no-jsx-runtime/ReactiveHydrate");
const {
  ReactiveHydrateLoader,
} = require("reactive-hydration/dist-no-jsx-runtime/ReactiveHydrateLoader");

const getTypeName = (type) =>
  type.displayName ??
  type.name ??
  type.render?.displayName ??
  type.render?.name;

const RTypes = new WeakMap();

const getType = (Type) => {
  if (RTypes.get(Type)) {
    return RTypes.get(Type);
  }

  const name = getTypeName(Type);

  const { states } = Type;

  const {
    // Strip this to avoid infinite recursion.
    reactiveHydrateLoader,
    ...RestType
  } = Type;

  let NewType;

  if (typeof Type === "function") {
    NewType = Type.bind({});
    Object.assign(NewType, RestType);
  } else {
    NewType = RestType;
  }

  const RType = reactiveHydrate(
    {
      name,
      states,
    },
    NewType
  );

  RTypes.set(Type, RType);

  return RType;
};

const forceHydrate =
  typeof window === "object"
    ? window.location.search.includes("forceHydrate")
    : false;

let initialUrl = typeof window === "object" ? window.location.href : undefined;
let hasSoftRouted = false;

exports.makeJsx = (_label, jsxRuntime) => {
  global.jsx_runtime_1 = jsxRuntime;

  const origJsx =
    jsxRuntime.createElement ?? jsxRuntime.jsxDEV ?? jsxRuntime.jsx;

  return (type, ...args) => {
    // TODO: Subscribe to location changes.
    if (!hasSoftRouted) {
      // TODO: Will this have ill effect on any rerenders during page transitions?
      if (typeof window === "object" && window.location.href !== initialUrl) {
        hasSoftRouted = true;
      }
    }

    if (type._context) {
      return origJsx(type, ...args);
    }

    // Handle our `React.lazy` wrappers for nested hydration deferral.
    if (type.reactiveHydrateLoader) {
      if (typeof window === "object" && !hasSoftRouted && !forceHydrate) {
        const name = getTypeName(type);

        // TODO: A component that consumes and renders the SSR HTML from its hydrating ancestor.
        return origJsx(ReactiveHydrateLoader, {
          name,
        });
      } else {
        const ReactiveHydrateType = getType(type);

        const [props] = args;

        return origJsx(ReactiveHydrateType, props);
      }
    }

    // TODO: Handle memo objects?
    if (typeof type !== "function") {
      return origJsx(type, ...args);
    }

    const Type = type;

    const [props, ...restArgs] = args;

    const { reactiveHydrateSkip, ...restProps } = props ?? {};

    const propsWithoutreactiveHydrateSkip = props ? restProps : props;

    if (props?.reactiveHydrateSkip) {
      return origJsx(type, propsWithoutreactiveHydrateSkip, ...restArgs);
    }

    const name = getTypeName(Type);

    if (!name) {
      return origJsx(Type, ...args);
    }

    if (type.reactiveHydrateSkip) {
      return origJsx(Type, ...args);
    }

    const ReactiveHydrateType = getType(Type);

    return origJsx(ReactiveHydrateType, ...args);
  };
};

/* eslint-disable no-import-assign */
/* eslint-disable react-hooks/rules-of-hooks -- Okay to disable here. In any given hook call, we won't change number of hook calls between renders. */
// import type { ComponentType, Context, ReactNode } from "react";
const React = require("_react");

// TODO: We may need to polyfill `createElement` similar to `jsx-runtime` for folks building that way.
// createElement,
const useContext = React.useContext;
const useState = React.useState;

// const React = require("_react");
// import { reactiveHydrate } from "../ReactiveHydrate";
// import { ReactiveHydrationContainerContext } from "../ReactiveHydrationContainerContext";
// import { ReactiveHydrationInnardsContext } from "../ReactiveHydrationInnardsContext";
// const {
//   useContextUsageTracker,
//   useStateSerialize,
// } = require("reactive-hydration");

// Deep imports to avoid pulling in anything like `react-dom` that will require `react`
// which would cause a circular dependency given our monkeypatch here registering as `react`.

const {
  useStateSerialize,
} = require("reactive-hydration/dist/useStateSerialize");
const {
  useContextUsageTracker,
} = require("reactive-hydration/dist/useContextUsageTracker");
const {
  ReactiveHydrationContainerContext,
} = require("reactive-hydration/dist/ReactiveHydrationContainerContext");

// console.log("*** React", React);

// const { logRender } = require("./log");

// const {
//   // TODO: We may need to polyfill `createElement` similar to `jsx-runtime` for folks building that way.
//   // createElement,
//   useContext,
//   useState,
// } = React;

// const createElementReactiveHydration = (type, props, ...children) => {
//   logRender("*** createElement", type);

//   return createElement(type, props, ...children);
// };

// // @ts-expect-error Hard to get types exactly right...
// React.createElement = createElementReactiveHydration;

// function createElementReactiveHydration<
//   P extends {
//     isReactiveHydrationServerComponent: boolean;
//     reactiveHydrateId?: string;
//     reactiveHydratePortalState?: Record<string, any>;
//   }
// >(
//   type:
//     | string
//     | (ComponentType<P> & {
//         states?: string;
//       }),
//   props: P,
//   ...children: ReactNode[]
// ) {
//   console.log("*** createElement type", type, props, children);

//   return createElement(type, props, ...children);

//   // if (typeof type === "string") {
//   //   return createElement(type, props, ...children);
//   // }

//   // // console.log("*** createElement", type);

//   // // if (
//   // //   // TODO: Will this detect `memo` wrappers?
//   // //   typeof type !== "function"
//   // // ) {
//   // //   return createElement(type, props, ...children);
//   // // }

//   // const name =
//   //   type.displayName ??
//   //   type.name ??
//   //   // @ts-expect-error We'll have a `render` property in case of `forwardRef` object, etc.
//   //   type.render?.displayName ??
//   //   // @ts-expect-error We'll have a `render` property in case of `forwardRef` object, etc.
//   //   type.render?.name;

//   // if (typeof type === "function" && !name) {
//   //   const message =
//   //     "reactive-hydration will be disabled for components without a `displayName` property.";

//   //   console.debug(message, type);

//   //   console.log("*** createElement deferring to native", type);

//   //   return createElement(type, props, ...children);
//   // }

//   // // @ts-expect-error May be a context object...
//   // if (type._context) {
//   //   console.log("*** createElement deferring to native", type);

//   //   return createElement(type, props, ...children);
//   // }

//   // // @ts-expect-error E.g. a context object won't have a `render`, but a forward ref will - any others?
//   // if (!type.render) {
//   //   console.log("*** createElement deferring to native", type);

//   //   return createElement(type, props, ...children);
//   // }

//   // console.log("*** createElement name", name);

// const Type = type;

// const { states } = Type;

// const ReactiveHydrateType = reactiveHydrate<P>(
//   {
//     name,
//     states,
//   },
//   Type
// );

// const NewType = forwardRef((props: P, ref) => {
//   const { isReactiveHydrationServerComponent } = props;

//   const { isWithinReactiveHydrationContainer } = useContext(
//     ReactiveHydrationContainerContext
//   );

//   const { isInReactiveHydrationInnards } =
//     useContext(ReactiveHydrationInnardsContext) ?? {};

//   console.log("*** NewType for", name, "booleans", {
//     isReactiveHydrationServerComponent,
//     isWithinReactiveHydrationContainer,
//     isInReactiveHydrationInnards,
//   });

//   if (
//     !isWithinReactiveHydrationContainer ||
//     isInReactiveHydrationInnards ||
//     isReactiveHydrationServerComponent
//   ) {
//     console.log("*** bypassing ReactiveHydrate wrapper", name);

//     return createElement(Type, props, ...children);
//   }

//   console.log("*** using ReactiveHydrate wrapper", name);

//   return createElement(ReactiveHydrateType, props, ...children);
// });

// NewType.displayName = `ReactiveHydrationCreateElementWrapper(${name})`;

//   // return createElement(
//   //   NewType,
//   //   // @ts-expect-error Types won't quite match here, but just forwarding.
//   //   props,
//   //   ...children
//   // );
// }

/**
 * @param {*} init
 * @param {*} bypass This isn't known to React, but passed by `reactive-hydration/react-actual`.
 */
const useStateReactiveHydrationMonkeypatch = (init, bypass) => {
  if (bypass) {
    return useState(init);
  }

  const { isWithinReactiveHydrationContainer } = useContext(
    ReactiveHydrationContainerContext
  );

  if (!isWithinReactiveHydrationContainer) {
    return useState(init);
  }

  return useStateSerialize(init);
};

React.useState = useStateReactiveHydrationMonkeypatch;

const useContextReactiveHydrationMonkeypatch = (Context, bypass) => {
  if (bypass) {
    return useContext(Context);
  }

  // const { isWithinReactiveHydrationContainer } = useContext(
  //   ReactiveHydrationContainerContext
  // );

  // console.log("*** useContextReactiveHydrationMonkeypatch", {
  //   isWithinReactiveHydrationContainer,
  // });

  // if (!isWithinReactiveHydrationContainer) {
  //   return useContext(Context);
  // }

  return useContextUsageTracker(Context);
};

React.useContext = useContextReactiveHydrationMonkeypatch;

// export default React;
// export = React;

module.exports = React;

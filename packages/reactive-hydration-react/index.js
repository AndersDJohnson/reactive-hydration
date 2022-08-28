/* eslint-disable react-hooks/rules-of-hooks -- Okay to disable here. In any given hook call, we won't change number of hook calls between renders. */
const React =
  typeof window !== "undefined"
    ? window.React || require("_react")
    : require("_react");

if (typeof window !== "undefined") {
  if (window.React) {
    console.log(
      "*** reactive-hydration-react index window.React.id",
      window.React.id
    );
  }
  window.React = window.React || React;
}

console.log("*** react reactive-hydration-react index React.id", React.id);

// TODO: We may need to polyfill `createElement` similar to `jsx-runtime` for folks building that way.
// const createElement = React.createElement;
const useContext = React.useContext;
const useState = React.useState;

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

/**
 * @param {*} init
 * @param {*} bypass This isn't known to React, but passed by `reactive-hydration/react-actual`.
 */
const useStateReactiveHydrationMonkeypatch = (init, bypass) => {
  return useState(init);
  // if (bypass) {
  //   return useState(init, true);
  // }

  // const { isWithinReactiveHydrationContainer } = useContext(
  //   ReactiveHydrationContainerContext,
  //   true
  // );

  // console.log(
  //   "*** useState isWithinReactiveHydrationContainer",
  //   isWithinReactiveHydrationContainer,
  //   init
  // );

  // if (!isWithinReactiveHydrationContainer) {
  //   return useState(init, true);
  // }

  // return useStateSerialize(init);
};

React.useState = useStateReactiveHydrationMonkeypatch;

const useContextReactiveHydrationMonkeypatch = (Context, bypass) => {
  return useContext(Context);

  // if (bypass) {
  //   try {
  //     return useContext(Context, true);
  //   } catch (error) {
  //     console.error(
  //       "*** ERROR useContextReactiveHydrationMonkeypatch",
  //       Context.displayName
  //     );
  //     throw error;
  //   }
  // }

  // return useContextUsageTracker(Context);
};

React.useContext = useContextReactiveHydrationMonkeypatch;

// export default React;
// export = React;

module.exports = React;

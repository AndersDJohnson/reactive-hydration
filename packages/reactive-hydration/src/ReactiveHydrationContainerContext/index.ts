import React, { createContext } from "_react";

export const ReactiveHydrationContainerContext = createContext({
  isWithinReactiveHydrationContainer: false,
  hasSoftRouted: false,
});

ReactiveHydrationContainerContext.displayName =
  "ReactiveHydrationContainerContext";

if (typeof global !== "undefined") {
  // @ts-expect-error
  if (global.ReactiveHydrationContainerContext) {
    module.exports =
      // @ts-expect-error
      global.ReactiveHydrationContainerContext;
  } else {
    // @ts-expect-error
    global.ReactiveHydrationContainerContext = exports;
  }
}

// TODO: Delete after debugging.
// @ts-expect-error
ReactiveHydrationContainerContext.id = Math.random();

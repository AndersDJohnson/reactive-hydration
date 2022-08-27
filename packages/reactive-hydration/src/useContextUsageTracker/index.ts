import React, { Context } from "_react";
import { useState, useContext } from "../react-actual";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";
import { ReactiveHydrationContainerContext } from "../ReactiveHydrationContainerContext";

export const useContextUsageTracker = <T>(Context: Context<T>) => {
  const contextValue = useContext(Context);

  const { isWithinReactiveHydrationContainer } = useContext(
    ReactiveHydrationContainerContext
  );

  const { usedHooksRef } = useContext(ReactiveHydrateContext);

  useState(() => {
    if (!isWithinReactiveHydrationContainer) return;

    if (!Context.displayName) {
      // const message = "Not serializing context without a `displayName`.";

      // console.debug(message, context);

      // throw new Error(message);

      return;
    }

    usedHooksRef?.current?.contexts.add(Context.displayName);
  });

  return contextValue;
};

if (typeof global !== "undefined") {
  // @ts-expect-error
  if (global.useContextUsageTracker) {
    module.exports =
      // @ts-expect-error
      global.useContextUsageTracker;
  } else {
    // @ts-expect-error
    global.useContextUsageTracker = exports;
  }
}

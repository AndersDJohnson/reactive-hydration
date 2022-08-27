import React, { Context, useContext, useState } from "_react";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";
import { ReactiveHydrationContainerContext } from "../ReactiveHydrationContainerContext";

export const useContextUsageTracker = <T>(context: Context<T>) => {
  const { isWithinReactiveHydrationContainer } = useContext(
    ReactiveHydrationContainerContext
  );

  const contextValue = useContext(context);

  const { usedHooksRef } = useContext(ReactiveHydrateContext);

  useState(() => {
    console.log(
      "*** useContextUsageTracker isWithinReactiveHydrationContainer",
      isWithinReactiveHydrationContainer
    );

    if (!isWithinReactiveHydrationContainer) return;

    console.log(
      "*** useContextUsageTracker context.displayName",
      context.displayName
    );

    if (!context.displayName) {
      // const message = "Not serializing context without a `displayName`.";

      // console.debug(message, context);

      // throw new Error(message);

      return;
    }

    usedHooksRef?.current?.contexts.add(context.displayName);
  });

  return contextValue;
};

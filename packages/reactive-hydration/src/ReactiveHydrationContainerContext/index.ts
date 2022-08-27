import { createContext } from "_react";

export const ReactiveHydrationContainerContext = createContext({
  isWithinReactiveHydrationContainer: false,
  hasSoftRouted: false,
});

ReactiveHydrationContainerContext.displayName =
  "ReactiveHydrationContainerContext";

// @ts-ignore
ReactiveHydrationContainerContext.id = Math.random();

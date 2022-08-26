import { createContext } from "_react";

export const ReactiveHydrationContainerContext = createContext({
  isWithinReactiveHydrationContainer: false,
  hasSoftRouted: false,
});

ReactiveHydrationContainerContext.displayName =
  "ReactiveHydrationContainerContext";

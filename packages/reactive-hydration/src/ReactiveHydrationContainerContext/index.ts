import { createContext } from "react";

export const ReactiveHydrationContainerContext = createContext({
  isActive: false,
  hasSoftRouted: false,
});

ReactiveHydrationContainerContext.displayName =
  "ReactiveHydrationContainerContext";

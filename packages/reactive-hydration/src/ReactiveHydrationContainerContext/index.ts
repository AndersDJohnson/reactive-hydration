import { createContext } from "../react-actual";

export const ReactiveHydrationContainerContext = createContext({
  isActive: false,
  hasSoftRouted: false,
});

ReactiveHydrationContainerContext.displayName =
  "ReactiveHydrationContainerContext";

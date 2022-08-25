import { createContext } from "../react-actual";

export const ReactiveHydrationContainerContext = createContext({
  isActive: false,
});

ReactiveHydrationContainerContext.displayName =
  "ReactiveHydrationContainerContext";

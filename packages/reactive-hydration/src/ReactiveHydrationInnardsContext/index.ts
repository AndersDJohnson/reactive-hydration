import { createContext } from "react-actual";

// TODO: Is this still needed?
export const ReactiveHydrationInnardsContext = createContext<
  | {
      isInReactiveHydrationInnards: true;
    }
  | undefined
>(undefined);

ReactiveHydrationInnardsContext.displayName = "ReactiveHydrationInnardsContext";

export const reactiveHydrationInnardsContextValue = {
  isInReactiveHydrationInnards: true as const,
};

import { createContext } from "_react";

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

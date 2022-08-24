import { RefObject, createContext } from "react";

export interface HooksRef {
  contexts: Set<string>;
}

/**
 * This is in its own file to avoid circular dependencies/imports when used in our "react" monkeypatch/alias.
 */
export const ReactiveHydrateContext = createContext<{
  reactiveHydratingId?: string;
  reactiveHydratePortalState?: Record<string, any>;
  parentComponentPath: (string | number)[];
  registerComponentPath?: (name: string) => number;
  unregisterComponentPath?: (name: string) => void;
  portalRef?: RefObject<HTMLElement>;
  hooksRef?: RefObject<HooksRef>;
}>({
  parentComponentPath: [],
});

ReactiveHydrateContext.displayName = "ReactiveHydrateContext";

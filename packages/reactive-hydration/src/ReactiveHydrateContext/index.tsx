import {
  RefObject,
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
} from "_react";
import { useState, useContext } from "../react-actual";

export interface HooksRef {
  contexts: Set<string>;
}

export const ReactiveHydrateContext = createContext<{
  reactiveHydratingId?: string;
  reactiveHydratePortalState?: Record<string, any>;
  parentComponentPath: (string | number)[];
  registerComponentPath?: (name: string) => number;
  unregisterComponentPath?: (name: string) => void;
  usedHooksRef?: RefObject<HooksRef>;
}>({
  parentComponentPath: [],
});

ReactiveHydrateContext.displayName = "ReactiveHydrateContext";

export const ReactiveHydrateContextProvider = (
  props: PropsWithChildren<{
    reactiveHydratingId?: string;
    reactiveHydratePortalState?: Record<string, any>;
    usedHooksRef?: RefObject<HooksRef>;
  }>
) => {
  const {
    children,
    reactiveHydratingId,
    reactiveHydratePortalState: reactiveHydratePortalStateProp,
    usedHooksRef,
  } = props;

  const [registry] = useState(() => new Map());

  const { reactiveHydratePortalState: reactiveHydratePortalStateContext } =
    useContext(ReactiveHydrateContext);

  const reactiveHydratePortalState =
    reactiveHydratePortalStateProp ?? reactiveHydratePortalStateContext;

  const registerComponentPath = useCallback(() => {
    const currentIndex = registry.get(name);

    const newIndex = (currentIndex ?? -1) + 1;

    registry.set(name, newIndex);

    return newIndex;
  }, [registry]);

  const unregisterComponentPath = useCallback(
    (name: string) => {
      const currentIndex = registry.get(name);

      registry.set(name, currentIndex - 1);
    },
    [registry]
  );

  const reactiveHydrationComponentPathContextValue = useMemo(
    () => ({
      reactiveHydratingId,
      reactiveHydratePortalState,
      parentComponentPath: [],
      registerComponentPath,
      unregisterComponentPath,
      usedHooksRef,
    }),
    [
      reactiveHydratingId,
      reactiveHydratePortalState,
      registerComponentPath,
      unregisterComponentPath,
      usedHooksRef,
    ]
  );

  return (
    <ReactiveHydrateContext.Provider
      value={reactiveHydrationComponentPathContextValue}
    >
      {children}
    </ReactiveHydrateContext.Provider>
  );
};

if (typeof global !== "undefined") {
  // @ts-expect-error
  if (global.ReactiveHydrateContext) {
    module.exports =
      // @ts-expect-error
      global.ReactiveHydrateContext;
  } else {
    // @ts-expect-error
    global.ReactiveHydrateContext = exports;
  }
}

// // @ts-expect-error For debugging only.
// ReactiveHydrateContext.id = Math.random();

ReactiveHydrateContextProvider.reactiveHydrateSkip = true;

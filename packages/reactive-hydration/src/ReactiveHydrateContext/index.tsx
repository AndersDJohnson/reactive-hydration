import {
  RefObject,
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
} from "react-actual";
import { useState, useContext } from "../react-actual";

export interface HooksRef {
  contexts: Set<string>;
}

export const ReactiveHydrateContext = createContext<{
  reactiveHydratingId?: string;
  reactiveHydrateNestedHtmlByComponentPath?: Record<string, string | undefined>;
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
    componentPath: (string | number)[];
    reactiveHydratingId?: string;
    reactiveHydrateNestedHtmlByComponentPath?: Record<
      string,
      string | undefined
    >;
    reactiveHydratePortalState?: Record<string, any>;
    usedHooksRef?: RefObject<HooksRef>;
  }>
) => {
  const {
    children,
    componentPath,
    reactiveHydratingId,
    reactiveHydrateNestedHtmlByComponentPath:
      reactiveHydrateNestedHtmlByComponentPathProp,
    reactiveHydratePortalState: reactiveHydratePortalStateProp,
    usedHooksRef,
  } = props;

  const [registry] = useState(() => new Map());

  const { reactiveHydratePortalState: reactiveHydratePortalStateContext } =
    useContext(ReactiveHydrateContext);

  const reactiveHydratePortalState =
    reactiveHydratePortalStateProp ?? reactiveHydratePortalStateContext;

  const reactiveHydrateNestedHtmlByComponentPath =
    reactiveHydrateNestedHtmlByComponentPathProp;
  // TODO: ?? reactiveHydrateNestedHtmlByComponentPathContext

  const registerComponentPath = useCallback(
    (name: string) => {
      const currentIndex = registry.get(name);

      const newIndex = (currentIndex ?? -1) + 1;

      registry.set(name, newIndex);

      return newIndex;
    },
    [registry]
  );

  const unregisterComponentPath = useCallback(
    (name: string) => {
      const currentIndex = registry.get(name) ?? 0;

      registry.set(name, currentIndex - 1);
    },
    [registry]
  );

  const reactiveHydrateContextValue = useMemo(
    () => ({
      reactiveHydratingId,
      reactiveHydrateNestedHtmlByComponentPath,
      reactiveHydratePortalState,
      parentComponentPath: componentPath ?? [],
      registerComponentPath,
      unregisterComponentPath,
      usedHooksRef,
    }),
    [
      componentPath,
      reactiveHydratingId,
      reactiveHydrateNestedHtmlByComponentPath,
      reactiveHydratePortalState,
      registerComponentPath,
      unregisterComponentPath,
      usedHooksRef,
    ]
  );

  return (
    <ReactiveHydrateContext.Provider value={reactiveHydrateContextValue}>
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

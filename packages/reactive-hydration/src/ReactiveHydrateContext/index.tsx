import { RefObject, useCallback } from "react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

export interface HooksRef {
  contexts: Set<string>;
}

export const ReactiveHydrateContext = createContext<{
  reactiveHydratingId?: string;
  reactiveHydratePortalState?: Record<string, any>;
  parentComponentPath: (string | number)[];
  registerComponentPath?: (name: string) => number;
  unregisterComponentPath?: (name: string) => void;
  portalRef?: RefObject<HTMLDivElement>;
  hooksRef?: RefObject<HooksRef>;
}>({
  parentComponentPath: [],
});

ReactiveHydrateContext.displayName = "ReactiveHydrateContext";

export const ReactiveHydrateContextProvider = (
  props: PropsWithChildren<{
    reactiveHydratingId?: string;
    reactiveHydratePortalState?: Record<string, any>;
    portalRef?: RefObject<HTMLDivElement>;
    hooksRef?: RefObject<HooksRef>;
  }>
) => {
  const {
    children,
    reactiveHydratingId,
    reactiveHydratePortalState: reactiveHydratePortalStateProp,
    portalRef,
    hooksRef,
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
      portalRef,
      hooksRef,
    }),
    [
      reactiveHydratingId,
      reactiveHydratePortalState,
      registerComponentPath,
      unregisterComponentPath,
      portalRef,
      hooksRef,
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

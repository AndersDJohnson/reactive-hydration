import { RefObject, PropsWithChildren, useCallback, useMemo } from "react";
import { createContext, useState, useContext } from "../react-actual";

export interface HooksRef {
  contexts: Set<string>;
}

export const ReactiveHydrateContext = createContext<{
  isActive: boolean;
  reactiveHydratingId?: string;
  reactiveHydratePortalState?: Record<string, any>;
  parentComponentPath: (string | number)[];
  registerComponentPath?: (name: string) => number;
  unregisterComponentPath?: (name: string) => void;
  portalRef?: RefObject<HTMLElement>;
  hooksRef?: RefObject<HooksRef>;
}>({
  isActive: false,
  parentComponentPath: [],
});

ReactiveHydrateContext.displayName = "ReactiveHydrateContext";

export const ReactiveHydrateContextProvider = (
  props: PropsWithChildren<{
    reactiveHydratingId?: string;
    reactiveHydratePortalState?: Record<string, any>;
    portalRef?: RefObject<HTMLElement>;
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
      isActive: true,
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

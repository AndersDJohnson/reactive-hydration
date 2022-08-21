import { useCallback } from "react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

export const ReactiveHydrationComponentPathContext = createContext<{
  reactiveHydratePortalState?: Record<string, any>;
  parentComponentPath: (string | number)[];
  registerComponentPath?: (name: string) => number;
  unregisterComponentPath?: (name: string) => void;
}>({
  parentComponentPath: [],
});

export const ReactiveHydrationComponentPathContextProvider = (
  props: PropsWithChildren<{
    reactiveHydratePortalState?: Record<string, any>;
  }>
) => {
  const {
    children,
    reactiveHydratePortalState: reactiveHydratePortalStateProp,
  } = props;

  const [registry] = useState(() => new Map());

  const { reactiveHydratePortalState: reactiveHydratePortalStateContext } =
    useContext(ReactiveHydrationComponentPathContext);

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
      reactiveHydratePortalState,
      parentComponentPath: [],
      registerComponentPath,
      unregisterComponentPath,
    }),
    [reactiveHydratePortalState, registerComponentPath, unregisterComponentPath]
  );

  return (
    <ReactiveHydrationComponentPathContext.Provider
      value={reactiveHydrationComponentPathContextValue}
    >
      {children}
    </ReactiveHydrationComponentPathContext.Provider>
  );
};

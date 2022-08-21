import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

export const ReactiveHydrationComponentPathContext = createContext<{
  reactiveHydratePortalState?: Record<string, any>;
  previousComponentPath: (string | number)[];
  registerComponentPath?: (name: string) => number;
  unregisterComponentPath?: (name: string) => void;
}>({
  previousComponentPath: [],
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

  const reactiveHydrationComponentPathContextValue = useMemo(
    () => ({
      reactiveHydratePortalState,
      previousComponentPath: [],
      registerComponentPath: (name: string) => {
        const currentIndex = registry.get(name);

        const newIndex = (currentIndex ?? -1) + 1;

        registry.set(name, newIndex);

        return newIndex;
      },
      unregisterComponentPath: (name: string) => {
        const currentIndex = registry.get(name);

        registry.set(name, currentIndex - 1);
      },
    }),
    [reactiveHydratePortalState, registry]
  );

  return (
    <ReactiveHydrationComponentPathContext.Provider
      value={reactiveHydrationComponentPathContextValue}
    >
      {children}
    </ReactiveHydrationComponentPathContext.Provider>
  );
};

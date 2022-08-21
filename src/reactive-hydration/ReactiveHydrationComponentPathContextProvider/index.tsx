import { createContext, PropsWithChildren, useMemo, useState } from "react";

export const ReactiveHydrationComponentPathContext = createContext<{
  previousComponentPath: (string | number)[];
  registerComponentPath?: (name: string) => number;
  unregisterComponentPath?: (name: string) => void;
}>({
  previousComponentPath: [],
});

export const ReactiveHydrationComponentPathContextProvider = (
  props: PropsWithChildren<unknown>
) => {
  const [registry] = useState(() => new Map());

  const reactiveHydrationComponentPathContextValue = useMemo(
    () => ({
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
    [registry]
  );

  return (
    <ReactiveHydrationComponentPathContext.Provider
      value={reactiveHydrationComponentPathContextValue}
    >
      {props.children}
    </ReactiveHydrationComponentPathContext.Provider>
  );
};

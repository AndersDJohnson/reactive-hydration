import { Context, PropsWithChildren, useId, useMemo } from "react-actual";
import { useContext } from "../react-actual";
import { ReactiveHydrationContainerContext } from "../ReactiveHydrationContainerContext";

const forceHydrate =
  typeof window === "object"
    ? window.location.search.includes("forceHydrate")
    : false;

const idByValueMap = new WeakMap<any, string>();

export function contextProviderSerialized<T>(context: Context<T>) {
  const { Provider, displayName } = context;

  const ContextProviderSerialized = (
    props: PropsWithChildren<{ value: T; id: string }>
  ) => {
    const { children, value, id: idProp } = props;

    const { hasSoftRouted } = useContext(ReactiveHydrationContainerContext);

    const serializedValue = useMemo(() => JSON.stringify(value), [value]);

    const usedId = useId();

    let idFromMap = idByValueMap.get(value);

    if (!idFromMap) {
      idFromMap = Math.random().toString();
      try {
        idByValueMap.set(value, idFromMap);
      } catch (error) {
        console.error("*** WeakMap error for value", value, error);
      }
    }

    const id =
      // This comes on initial client hydration on hard route.
      idProp ??
      // This is used on SSR to give a shared ID between shared source values, so updates are synchronized, just as they would likely be on the client.
      // TODO: We don't really want to do this in case of value coming from a global constant, rather than memoized `useState`...
      idFromMap ??
      // Fallback to a randomly generated unique ID for this context instance.
      usedId;

    if (typeof window === "object" && !hasSoftRouted && !forceHydrate) {
      return (
        // <div
        //   data-context-id={id}
        //   data-context-name={displayName}
        //   data-context-value={serializedValue}
        // >
        <Provider value={value}>{children}</Provider>
        // </div>
      );
    }

    return (
      <div
        data-context-id={forceHydrate ? "" : id}
        data-context-name={displayName}
        data-context-value={serializedValue}
      >
        <Provider value={value}>{children}</Provider>
      </div>
    );
  };

  ContextProviderSerialized.displayName = `ContextProviderSerialized(${displayName})`;

  ContextProviderSerialized.reactiveHydrateSkip = true;

  return ContextProviderSerialized;
}

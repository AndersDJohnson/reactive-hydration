import { Context, PropsWithChildren, useId, useMemo } from "react";
import { useContext } from "../react-actual";
import { ReactiveHydrationContainerContext } from "../ReactiveHydrationContainerContext";

export function contextProviderSerialized<T>(context: Context<T>) {
  const { Provider, displayName } = context;

  const ContextProviderSerialized = (
    props: PropsWithChildren<{ value: T }>
  ) => {
    const { children, value } = props;

    const { hasSoftRouted } = useContext(ReactiveHydrationContainerContext);

    // eslint-disable-next-line react-hooks/rules-of-hooks -- Okay to disable here. In any given re-render, we won't change number of hook calls between renders.
    const serializedValue = useMemo(() => JSON.stringify(value), [value]);

    // eslint-disable-next-line react-hooks/rules-of-hooks -- Okay to disable here. In any given re-render, we won't change number of hook calls between renders.
    const id = useId();

    // // Otherwise we get dummy context DOM nodes where the portals are rendered into the React tree.
    // // TODO: Is this ok on soft routes, to maintain a resumable DOM snapshot throughout interactions?
    if (typeof window === "object" && !hasSoftRouted) {
      return <Provider value={value}>{children}</Provider>;
    }

    return (
      <div
        data-context-id={id}
        data-context-name={displayName}
        data-context-value={serializedValue}
      >
        <Provider value={value}>{children}</Provider>
      </div>
    );
  };

  ContextProviderSerialized.displayName = `ContextProviderSerialized(${displayName})`;

  return ContextProviderSerialized;
}

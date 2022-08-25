import { Context, PropsWithChildren, useId, useMemo } from "react";
import { useContext } from "../react-actual";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";

export function contextProviderSerialized<T>({
  Provider,
  displayName,
}: Context<T>): Context<T>["Provider"] {
  const ContextProviderSerialized = (
    props: PropsWithChildren<{ value: T }>
  ) => {
    const { children, value } = props;

    const reactiveHydrateContext = useContext(ReactiveHydrateContext);

    if (!reactiveHydrateContext.isActive) {
      return <Provider value={value}>{children}</Provider>;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks -- Okay to disable here. In any given render, we won't change number of hook calls between renders.
    const serializedValue = useMemo(() => JSON.stringify(value), [value]);

    // eslint-disable-next-line react-hooks/rules-of-hooks -- Okay to disable here. In any given render, we won't change number of hook calls between renders.
    const id = useId();

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

  Object.assign(ContextProviderSerialized, Provider);

  ContextProviderSerialized.displayName = `ContextProviderSerialized(${displayName})`;

  // @ts-expect-error Hopefully the `Object.assign` above accounts for this.
  return ContextProviderSerialized;
}

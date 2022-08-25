import { ComponentType, PropsWithChildren, useEffect, useMemo } from "react";

export function makeContextDefaultProviderWrapper<T>(
  Provider: ComponentType<PropsWithChildren<{ value: T }>>,
  serializedValue: T,
  setContextValue: (value: T) => void
) {
  const ContextDefaultProviderWrapper = (
    props: PropsWithChildren<{ value: T }>
  ) => {
    const { children, value } = props;

    useEffect(() => {
      const {
        // @ts-expect-error ID isn't on the types but should be at runtime...
        __id,
        ...valueWithoutId
      } = value ?? {};

      setContextValue({
        // Apply defaults from server (as an alternative to having to setup `useState` defaults in your `createContextWithDefaultValue` `DefaultProvider`.).
        // This also supports carrying forward our SSR `__id` property to sync different contexts who shared the same source value on SSR.
        // TODO: Will this cause problems if a value needs to be deleted/unset from context? At least specified but undefined keys will override with spread operator, right?
        ...serializedValue,
        // We don't want to override SSR `__id` value on client-side.
        ...valueWithoutId,
      });
    }, [value]);

    return <Provider value={value}>{children}</Provider>;
  };

  ContextDefaultProviderWrapper.displayName = "ContextDefaultProviderWrapper";

  return ContextDefaultProviderWrapper;
}

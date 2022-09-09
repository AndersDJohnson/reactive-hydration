import { ComponentType, PropsWithChildren, useEffect } from "_react";

export function makeContextDefaultProviderWrapper<T>(
  id: string,
  Provider: ComponentType<PropsWithChildren<{ value: T; id: string }>>,
  serializedValue: T,
  setContextValue: (value: T) => void
) {
  const ContextDefaultProviderWrapper = (
    props: PropsWithChildren<{ value: T }>
  ) => {
    const { children, value } = props;

    useEffect(() => {
      setContextValue({
        // Apply defaults from server (as an alternative to having to setup `useState` defaults in your `createContextWithDefaultValue` `DefaultProvider`.).
        // TODO: Will this cause problems if a value needs to be deleted/unset from context? At least specified but undefined keys will override with spread operator, right?
        ...serializedValue,
        ...value,
      });
    }, [value]);

    return (
      <Provider id={id} value={value}>
        {children}
      </Provider>
    );
  };

  ContextDefaultProviderWrapper.displayName = "ContextDefaultProviderWrapper";

  ContextDefaultProviderWrapper.reactiveHydrateSkip = true;

  return ContextDefaultProviderWrapper;
}

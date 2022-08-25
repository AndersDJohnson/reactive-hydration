import { ComponentType, PropsWithChildren, useEffect } from "react";

export function makeContextDefaultProviderWrapper<T>(
  Provider: ComponentType<PropsWithChildren<{ value: T }>>,
  setContextValue: (value: T) => void
) {
  const ContextDefaultProviderWrapper = (
    props: PropsWithChildren<{ value: T }>
  ) => {
    const { children, value } = props;

    useEffect(() => {
      setContextValue(value);
    }, [value]);

    return <Provider value={value}>{children}</Provider>;
  };

  ContextDefaultProviderWrapper.displayName = "ContextDefaultProviderWrapper";

  return ContextDefaultProviderWrapper;
}

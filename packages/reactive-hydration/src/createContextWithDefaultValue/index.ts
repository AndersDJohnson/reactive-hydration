import {
  ComponentType,
  Context,
  PropsWithChildren,
  // eslint-disable-next-line no-restricted-imports -- Here we do want our monkeypatched version to use within our consumer-facing wrapper.
  createContext,
} from "react";

export type ContextUpdater<T> = (value: T) => void;

export type ContextDefaultProvider<T> = ComponentType<
  PropsWithChildren<{
    Context: ContextWithDefaultValues<T>;
    serializedValue: T;
    setContextValue: (value: T) => void;
  }>
>;

export interface ContextDefaultValues<T> {
  displayName: string;
  defaultValue: T;
  DefaultProvider: ContextDefaultProvider<T>;
}

export type ContextWithDefaultValues<T> = Context<T> & ContextDefaultValues<T>;

export function createContextWithDefaultValue<T>(
  displayName: string,
  defaultValue: T,
  DefaultProvider: ContextDefaultProvider<T>
) {
  const RawContext = createContext<T>(
    defaultValue,
    // @ts-expect-error Pass `displayName` to monkeypatch.
    displayName
  ) as ContextWithDefaultValues<T>;

  RawContext.defaultValue = defaultValue;

  DefaultProvider.displayName = "DefaultProvider";

  RawContext.DefaultProvider = DefaultProvider;

  RawContext.displayName = displayName;

  return RawContext;
}

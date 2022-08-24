import {
  ComponentType,
  Context,
  createContext,
  PropsWithChildren,
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
    defaultValue
  ) as ContextWithDefaultValues<T>;

  RawContext.defaultValue = defaultValue;

  DefaultProvider.displayName = "DefaultProvider";

  RawContext.DefaultProvider = DefaultProvider;

  RawContext.displayName = displayName;

  return RawContext;
}

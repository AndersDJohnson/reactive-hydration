import {
  ComponentType,
  Context,
  PropsWithChildren,
  // eslint-disable-next-line no-restricted-imports -- Here we do want our monkeypatched version to use within our consumer-facing wrapper.
  createContext,
} from "react";
import { contextProviderSerialized } from "../contextProviderSerialized";

export type ContextUpdater<T> = (value: T) => void;

export type ContextDefaultProvider<T> = ComponentType<
  PropsWithChildren<{
    Provider: Context<T>["Provider"];
    serializedValue: T;
    setContextValue: (value: T) => void;
  }>
>;

export interface ContextDefaultValues<T> {
  displayName: string;
  defaultValue: T;
  ActualProvider: Context<T>["Provider"];
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

  // @ ts-expect-error We know this isn't a native Provider, but a wrapper - but consumers should mostly use it without knowing the difference.
  // RawContext.Provider = contextProviderSerialized(RawContext);

  DefaultProvider.displayName = "DefaultProvider";

  RawContext.ActualProvider = RawContext.Provider;

  RawContext.DefaultProvider = DefaultProvider;

  RawContext.displayName = displayName;

  return RawContext;
}

import {
  ComponentType,
  Context,
  PropsWithChildren,
  createContext,
} from "react-actual";
import { contextProviderSerialized } from "../contextProviderSerialized";

export type ContextUpdater<T> = (value: T) => void;

export type ContextDefaultProvider<T> = ComponentType<
  PropsWithChildren<{
    Provider: ComponentType<PropsWithChildren<{ value: T }>>;
    deserializedValue: T;
    defaultValue: T;
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

  RawContext.displayName = displayName;

  RawContext.defaultValue = defaultValue;

  // @ts-expect-error We know this isn't a native Provider, but a wrapper - but consumers should mostly use it without knowing the difference.
  RawContext.Provider = contextProviderSerialized(RawContext);

  // @ts-expect-error This is special property known to us only.
  DefaultProvider.reactiveHydrateSkip = true;

  RawContext.DefaultProvider = DefaultProvider;

  DefaultProvider.displayName = "DefaultProvider";

  return RawContext;
}

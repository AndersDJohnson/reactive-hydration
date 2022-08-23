import {
  ComponentType,
  Context,
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";

export type ContextDefaultProvider<T> = ComponentType<
  PropsWithChildren<{
    Context: ContextWithDefaultValues<T>;
    serializedElement: HTMLElement;
    serializedValue: T;
  }>
>;

export interface ContextDefaultValues<T> {
  defaultValue: T;
  DefaultProvider: ContextDefaultProvider<T>;
}

export type ContextWithDefaultValues<T> = Context<T> & ContextDefaultValues<T>;

export function createContextWithDefaultValue<T>(
  defaultValue: T,
  DefaultProvider: ContextDefaultProvider<T>
) {
  const RawContext = createContext<T>(
    defaultValue
  ) as ContextWithDefaultValues<T>;

  RawContext.defaultValue = defaultValue;

  RawContext.DefaultProvider = DefaultProvider;

  return RawContext;
}

export const useContextReactiveHydration = <T>(context: Context<T>) => {
  const contextValue = useContext(context);

  const { hooksRef } = useContext(ReactiveHydrateContext);

  useState(() => {
    if (!context.displayName) {
      throw new Error("Serialized contexts must have a `displayName`.");
    }

    hooksRef?.current?.contexts.add(context.displayName);
  });

  return contextValue;
};

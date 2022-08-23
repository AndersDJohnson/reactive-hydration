import { Context, createContext } from "react";

export type ContextWithDefaultValue<T> = Context<T> & {
  readonly defaultValue: T;
};

const createContextWithDefaultValue = <T>(defaultValue: T) => {
  const RawContext = createContext<T>(
    defaultValue
  ) as ContextWithDefaultValue<T>;

  // @ts-expect-error We only initialize once.
  RawContext.defaultValue = defaultValue;

  return RawContext;
};

const defaultValue = {
  message: "default",
  setMessage: (_: string) => {},
};

export const MyContext = createContextWithDefaultValue(defaultValue);

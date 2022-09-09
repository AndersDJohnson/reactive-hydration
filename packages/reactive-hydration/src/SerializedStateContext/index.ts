import { createContext } from "_react";

export const SerializedStateContext = createContext<
  | {
      serializableState: string[] | undefined;
      setSerializableState:
        | (() => string[])
        | ((sf: (s: any[] | undefined) => any[] | undefined) => void);
      reactiveHydrateState?: any[];
    }
  | undefined
>(undefined);

SerializedStateContext.displayName = "SerializedStateContext";

if (typeof global !== "undefined") {
  // @ts-expect-error
  if (global.SerializedStateContext) {
    module.exports =
      // @ts-expect-error
      global.SerializedStateContext;
  } else {
    // @ts-expect-error
    global.SerializedStateContext = exports;
  }
}

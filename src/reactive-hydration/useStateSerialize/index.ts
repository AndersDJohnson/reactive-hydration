import { createContext, useContext, useEffect, useRef, useState } from "react";

export const SerializedStateContext = createContext<
  | {
      serializedState: string[] | undefined;
      setSerializedState:
        | (() => string[])
        | ((sf: (s: string[] | undefined) => string[] | undefined) => void);
      /**
       * @deprecated May not need after `reactiveHydratePortalState`.
       */
      reactiveHydrateInit?: any[];
    }
  | undefined
>(undefined);

export const useStateSerialize = <S>(init: S | (() => S)) => {
  const { serializedState, setSerializedState, reactiveHydrateInit } =
    useContext(SerializedStateContext) ?? {};

  const ref = useRef<number>(
    serializedState?.length ??
      // In practice this fallback will never happen.
      0
  );

  const stateIndex = ref.current;

  const initOverride = reactiveHydrateInit?.[stateIndex] as S;

  const result = useState(
    () =>
      initOverride ??
      (typeof init === "function"
        ? // @ts-expect-error Not sure why it can't infer this type.
          (init() as S)
        : init)
  );

  const [state] = result;

  useEffect(() => {
    setSerializedState?.((s) => {
      const json = JSON.stringify(state);

      return stateIndex == null
        ? s
        : !s || stateIndex === 0
        ? [json]
        : [...s].splice(stateIndex, 0, json);
    });
  }, [setSerializedState, state, stateIndex]);

  return result;
};

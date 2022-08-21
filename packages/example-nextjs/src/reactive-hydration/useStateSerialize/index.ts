import { createContext, useContext, useEffect, useRef, useState } from "react";

export const SerializedStateContext = createContext<
  | {
      serializableState: string[] | undefined;
      setSerializedState:
        | (() => string[])
        | ((sf: (s: any[] | undefined) => any[] | undefined) => void);
      reactiveHydrateState?: any[];
    }
  | undefined
>(undefined);

export const useStateSerialize = <S>(init: S | (() => S)) => {
  const { serializableState, setSerializedState, reactiveHydrateState } =
    useContext(SerializedStateContext) ?? {};

  // TODO: For better performance, consider an optional optimization to no longer serialize the state
  // after the entire tree has been hydrated (walking up ancestor components to root).

  const ref = useRef<number>(
    serializableState?.length ??
      // In practice this fallback will never happen.
      0
  );

  const stateIndex = ref.current;

  // TODO: Instead of relying on state index, which could break with hydration mismatches,
  // consider generating a unique state ID for each `useState` at compile-time
  // and then looking up its value based on that ID and the component path (to account for multiple instances).
  const initOverride = reactiveHydrateState?.[stateIndex] as S;

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
      return stateIndex == null
        ? s
        : !s || stateIndex === 0
        ? [state]
        : [...s].splice(stateIndex, 0, state);
    });
  }, [setSerializedState, state, stateIndex]);

  return result;
};

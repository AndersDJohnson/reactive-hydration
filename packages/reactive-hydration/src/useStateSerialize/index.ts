import { useCallback, useRef } from "_react";
import { useContext, useState } from "../react-actual";
import { SerializedStateContext } from "../SerializedStateContext";

export const useStateSerialize = <S>(init: S | (() => S)) => {
  const { serializableState, setSerializableState, reactiveHydrateState } =
    useContext(SerializedStateContext) ?? {};

  console.log("*** useStateSerialize serializableState", serializableState);

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

  const [state, setState] = useState(
    () =>
      initOverride ??
      (typeof init === "function"
        ? // @ts-expect-error Not sure why it can't infer this type.
          (init() as S)
        : init)
  );

  const setStateAndSerializedState = useCallback(
    (value: S) => {
      setState((currentState) => {
        const actualValue =
          typeof value === "function" ? value(currentState) : value;

        setTimeout(() => {
          setSerializableState?.((previousStates) => {
            console.log(
              "*** useStateSerialize setSerializableState",
              stateIndex,
              value,
              previousStates
            );

            return stateIndex == null
              ? previousStates
              : !previousStates || stateIndex === 0
              ? [actualValue]
              : [...previousStates].splice(stateIndex, 0, actualValue);
          });
        });

        return actualValue;
      });
    },
    [setSerializableState, stateIndex]
  );

  return [state, setStateAndSerializedState] as const;
};

if (typeof global !== "undefined") {
  // @ts-expect-error
  if (global.useStateSerialize) {
    module.exports =
      // @ts-expect-error
      global.useStateSerialize;
  } else {
    // @ts-expect-error
    global.useStateSerialize = exports;
  }
}

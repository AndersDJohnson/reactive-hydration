import { useCallback, useContext, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { reactiveHydrate } from "reactive-hydration";
import { textState } from "../../state/textState";
import { ContextWithDefaultValue, MyContext } from "../MyContext";

function useContextSerialized<T>(
  contextName: string,
  context: ContextWithDefaultValue<T>
) {
  const [serializedDefaultValue] = useState(() =>
    JSON.stringify(context.defaultValue)
  );

  const [deserializedValue, setDeserializedValue] = useState<T>();

  const contextBeaconRef = useCallback((el: HTMLDivElement) => {
    console.log("*** el", el);

    const selector = `[data-context-name="${contextName}"]`;

    console.log("*** selector", selector);

    const closestContextElementByName = el.closest<HTMLElement>(selector);

    console.log("*** closestContextElementByName", closestContextElementByName);

    const serializedValue = closestContextElementByName?.dataset.contextValue;

    console.log("*** serializedValue", serializedValue);

    if (!serializedValue) return;

    setDeserializedValue(JSON.parse(serializedValue));
  }, []);

  const liveValue = useContext(context);

  const isLiveValueDefaultValue = useMemo(
    () => JSON.stringify(liveValue) === serializedDefaultValue,
    [liveValue]
  );

  console.log("*** isLiveValueDefaultValue", isLiveValueDefaultValue);
  console.log("*** deserializedValue", deserializedValue);

  const value = isLiveValueDefaultValue
    ? deserializedValue ?? liveValue
    : liveValue;

  return {
    contextBeaconRef,
    value,
  };
}

export const ExampleClientComponent1 = reactiveHydrate(
  {
    name: "ExampleClientComponent1",
    states: "textState",
  },
  () => {
    const [text] = useRecoilState(textState);

    const {
      contextBeaconRef: myContextBeaconRef,
      value: { message },
    } = useContextSerialized("MyContext", MyContext);

    return (
      <>
        <div data-context-beacon="MyContext" ref={myContextBeaconRef} />

        <h4>ExampleClientComponent1</h4>

        <div>recoil textState = {text}</div>

        <div>context message = {message}</div>
      </>
    );
  }
);

ExampleClientComponent1.displayName = "ExampleClientComponent1";

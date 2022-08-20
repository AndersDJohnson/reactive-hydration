import { useCallback, useId, useState } from "react";
import { useAtom } from "jotai";
import { ReactiveHydrate } from "reactive-hydration";
import { text2State } from "state/text2State";

export const ExampleClientComponent2 = () => {
  const [text2] = useAtom(text2State);

  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => setCount((c) => c + 1), []);

  // TODO: If these IDs isn't stable enough, we could just resolve the DOM children at runtime that aren't nested inside a deeper client component.
  const id = useId();

  return (
    <ReactiveHydrate id={id} name="ExampleClientComponent2" states="text2State">
      <h4>ExampleClientComponent2</h4>
      <div>SERVER? {(typeof window !== "object").toString()}</div>
      <div>TEXT 2 STATE: {text2}</div>
      <div>COUNT: {count}</div>
      <button onClick={handleClick} data-id={id} data-click="1">
        count++
      </button>
    </ReactiveHydrate>
  );
};

ExampleClientComponent2.displayName = "ExampleClientComponent2";

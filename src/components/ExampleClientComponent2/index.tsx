import { useCallback } from "react";
import { useAtom } from "jotai";
import { reactiveHydrate, useStateSerialize } from "reactive-hydration";
import { text2State } from "state/text2State";

const useState = useStateSerialize;

export const ExampleClientComponent2 = reactiveHydrate(
  {
    name: "ExampleClientComponent2",
    states: "text2State",
  },
  () => {
    const [text2] = useAtom(text2State);

    const [count, setCount] = useState(0);

    const handleClick = useCallback(() => setCount((c) => c + 1), []);

    return (
      <>
        <h4>ExampleClientComponent2</h4>
        <div>SERVER? {(typeof window !== "object").toString()}</div>
        <div>TEXT 2 STATE: {text2}</div>
        <div>COUNT: {count}</div>
        <button onClick={handleClick} data-click>
          count++
        </button>
      </>
    );
  }
);

ExampleClientComponent2.displayName = "ExampleClientComponent2";

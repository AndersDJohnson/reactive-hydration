import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { reactiveHydrate } from "reactive-hydration";
import { text2State } from "../../state/text2State";

export const ExampleClientComponent2 = reactiveHydrate(
  {
    name: "ExampleClientComponent2",
    states: "text2State",
  },
  () => {
    const [text2] = useRecoilState(text2State);

    const [count, setCount] = useState(0);

    const handleClick = useCallback(() => setCount((c) => c + 1), []);

    return (
      <>
        <h4>ExampleClientComponent2</h4>

        <div>recoil text2State = {text2}</div>
        <div>useState count = {count}</div>

        <button onClick={handleClick} data-click>
          count++
        </button>

        <button data-click>hydrate</button>
      </>
    );
  }
);

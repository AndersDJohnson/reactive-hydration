import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { text2State } from "../../state/text2State";

export const ExampleClientComponent2 = () => {
  const [text2] = useAtom(text2State);

  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => setCount((c) => c + 1), []);

  return (
    // This state metadata could perhaps be injected in a wrapper by the compiler...
    <div data-component="ExampleClientComponent2" data-states="text2State">
      <h4>ExampleClientComponent2</h4>
      <div>SERVER? {(typeof window !== "object").toString()}</div>
      <div>TEXT 2 STATE: {text2}</div>
      <div>COUNT: {count}</div>
      <button onClick={handleClick}>count++</button>
    </div>
  );
};

ExampleClientComponent2.displayName = "ExampleClientComponent2";

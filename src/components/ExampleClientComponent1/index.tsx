import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { textState } from "../../state/textState";

export const ExampleClientComponent1 = () => {
  const [text] = useAtom(textState);

  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => setCount((c) => c + 1), []);

  return (
    // This state metadata could perhaps be injected in a wrapper by the compiler...
    <div data-component="ExampleClientComponent1" data-states="textState">
      <h4>ExampleClientComponent1</h4>
      <div>SERVER? {(typeof window !== "object").toString()}</div>A
      <div>TEXT STATE: {text}</div>
      <div>COUNT: {count}</div>
      <button onClick={handleClick}>count++</button>
    </div>
  );
};

ExampleClientComponent1.displayName = "ExampleClientComponent1";

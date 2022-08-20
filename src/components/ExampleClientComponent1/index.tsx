import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { textState } from "../../state/textState";
import { ClientComponent } from "../../ClientComponent";

export const ExampleClientComponent1 = () => {
  const [text] = useAtom(textState);

  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => setCount((c) => c + 1), []);

  return (
    <ClientComponent name="ExampleClientComponent1" states="textState">
      <h4>ExampleClientComponent1</h4>
      <div>SERVER? {(typeof window !== "object").toString()}</div>A
      <div>TEXT STATE: {text}</div>
      <div>COUNT: {count}</div>
      <button onClick={handleClick}>count++</button>
    </ClientComponent>
  );
};

ExampleClientComponent1.displayName = "ExampleClientComponent1";

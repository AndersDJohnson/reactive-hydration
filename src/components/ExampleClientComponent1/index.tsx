import { useAtom } from "jotai";
import { ReactiveHydrate } from "reactive-hydration";
import { textState } from "state/textState";

export const ExampleClientComponent1 = () => {
  const [text] = useAtom(textState);

  return (
    <ReactiveHydrate name="ExampleClientComponent1" states="textState">
      <h4>ExampleClientComponent1</h4>
      <div>SERVER? {(typeof window !== "object").toString()}</div>
      <div>TEXT STATE: {text}</div>
    </ReactiveHydrate>
  );
};

ExampleClientComponent1.displayName = "ExampleClientComponent1";

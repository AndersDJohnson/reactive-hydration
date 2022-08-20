import { useAtom } from "jotai";
import { ReactiveHydrate } from "reactive-hydration";
import { textState } from "state/textState";
import { ExampleClientComponent2 } from "components/ExampleClientComponent2";

export const ExampleClientComponentNesting = () => {
  const [text] = useAtom(textState);

  return (
    <ReactiveHydrate name="ExampleClientComponentNesting" states="textState">
      <h4>ExampleClientComponentNesting</h4>
      <div>SERVER? {(typeof window !== "object").toString()}</div>
      <div>TEXT STATE: {text}</div>
      <div style={{ paddingLeft: 48 }}>
        (Nested...)
        <ExampleClientComponent2 />
        (...nested!)
      </div>
    </ReactiveHydrate>
  );
};

ExampleClientComponentNesting.displayName = "ExampleClientComponentNesting";

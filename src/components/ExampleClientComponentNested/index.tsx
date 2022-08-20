import { useAtom } from "jotai";
import { textState } from "../../state/textState";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";

export const ExampleClientComponentNested = () => {
  const [text] = useAtom(textState);

  return (
    // This state metadata could perhaps be injected in a wrapper by the compiler...
    <div data-component="ExampleClientComponentNested" data-states="textState">
      <h2>ExampleClientComponentNested</h2>
      <div>SERVER? {(typeof window !== "object").toString()}</div>
      <div>TEXT STATE: {text}</div>
      <div style={{ paddingLeft: 48 }}>
        (Nested...)
        <ExampleClientComponent2 />
        (...nested!)
      </div>
    </div>
  );
};

ExampleClientComponentNested.displayName = "ExampleClientComponentNested";

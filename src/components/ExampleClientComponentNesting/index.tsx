import { useAtom } from "jotai";
import { textState } from "../../state/textState";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";

export const ExampleClientComponentNesting = () => {
  const [text] = useAtom(textState);

  return (
    // This state metadata could perhaps be injected in a wrapper by the compiler...
    <div data-component="ExampleClientComponentNesting" data-states="textState">
      <h4>ExampleClientComponentNesting</h4>
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

ExampleClientComponentNesting.displayName = "ExampleClientComponentNesting";

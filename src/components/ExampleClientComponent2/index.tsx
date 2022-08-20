import { useAtom } from "jotai";
import { textState } from "../../state/textState";
import { text2State } from "../../state/text2State";

export const ExampleClientComponent2 = () => {
  const [text] = useAtom(textState);
  const [text2] = useAtom(text2State);

  return (
    // This state metadata could perhaps be injected in a wrapper by the compiler...
    <div data-component="ExampleClientComponent2" data-states="text2State">
      <h2>ExampleClientComponent2</h2>
      <div>SERVER? {(typeof window !== "object").toString()}</div>
      <div>TEXT 2 STATE: {text2}</div>
    </div>
  );
};

ExampleClientComponent2.displayName = "ExampleClientComponent2";

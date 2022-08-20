import { useAtom } from "jotai";
import { textState } from "../../state/textState";
import { text2State } from "../../state/text2State";

export const ExampleClientComponent = () => {
  const [text] = useAtom(textState);
  const [text2] = useAtom(text2State);

  return (
    // This state metadata could perhaps be injected in a wrapper by the compiler...
    <div
      data-component="ExampleClientComponent"
      data-states="textState,text2State"
    >
      <div>SERVER? {(typeof window !== "object").toString()}</div>
      <div>TEXT STATE: {text}</div>
      <div>TEXT 2 STATE: {text2}</div>
    </div>
  );
};

ExampleClientComponent.displayName = "ExampleClientComponent";

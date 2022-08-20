import { useAtom } from "jotai";
import { textState } from "../../state/textState";
import { text2State } from "../../state/text2State";
import { ClientComponent } from "../../ClientComponent";

export const ExampleClientComponent = () => {
  const [text] = useAtom(textState);
  const [text2] = useAtom(text2State);

  return (
    <ClientComponent
      name="ExampleClientComponent"
      states="textState,text2State"
    >
      <h4>ExampleClientComponent</h4>
      <div>SERVER? {(typeof window !== "object").toString()}</div>
      <div>TEXT STATE: {text}</div>
      <div>TEXT 2 STATE: {text2}</div>
    </ClientComponent>
  );
};

ExampleClientComponent.displayName = "ExampleClientComponent";

import { useAtom } from "jotai";
import { textState } from "../../state/textState";
import { ClientComponent } from "../../ClientComponent";

export const ExampleClientComponent1 = () => {
  const [text] = useAtom(textState);

  return (
    <ClientComponent name="ExampleClientComponent1" states="textState">
      <h4>ExampleClientComponent1</h4>
      <div>SERVER? {(typeof window !== "object").toString()}</div>A
      <div>TEXT STATE: {text}</div>
    </ClientComponent>
  );
};

ExampleClientComponent1.displayName = "ExampleClientComponent1";

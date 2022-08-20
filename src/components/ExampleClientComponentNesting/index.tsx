import { useAtom } from "jotai";
import { ClientComponent } from "../../ClientComponent";
import { textState } from "../../state/textState";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";

export const ExampleClientComponentNesting = () => {
  const [text] = useAtom(textState);

  return (
    <ClientComponent name="ExampleClientComponentNesting" states="textState">
      <h4>ExampleClientComponentNesting</h4>
      <div>SERVER? {(typeof window !== "object").toString()}</div>
      <div>TEXT STATE: {text}</div>
      <div style={{ paddingLeft: 48 }}>
        (Nested...)
        <ExampleClientComponent2 />
        (...nested!)
      </div>
    </ClientComponent>
  );
};

ExampleClientComponentNesting.displayName = "ExampleClientComponentNesting";

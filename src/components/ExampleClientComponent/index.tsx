import { useAtom } from "jotai";
import { reactiveHydrate } from "reactive-hydration";
import { textState } from "state/textState";
import { text2State } from "state/text2State";

export const ExampleClientComponent = reactiveHydrate(
  {
    name: "ExampleClientComponent",
    states: "textState,text2State",
  },
  () => {
    const [text] = useAtom(textState);
    const [text2] = useAtom(text2State);

    return (
      <>
        <h4>ExampleClientComponent</h4>
        <div>SERVER? {(typeof window !== "object").toString()}</div>
        <div>TEXT STATE: {text}</div>
        <div>TEXT 2 STATE: {text2}</div>
      </>
    );
  }
);

ExampleClientComponent.displayName = "ExampleClientComponent";

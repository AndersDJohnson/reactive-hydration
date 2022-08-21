import { useAtom } from "jotai";
import { reactiveHydrate } from "reactive-hydration";
import { textState } from "state/textState";

export const ExampleClientComponent1 = reactiveHydrate(
  {
    name: "ExampleClientComponent1",
    states: "textState",
  },
  () => {
    const [text] = useAtom(textState);

    return (
      <>
        <h4>ExampleClientComponent1</h4>
        <div>SERVER? {(typeof window !== "object").toString()}</div>
        <div>TEXT STATE: {text}</div>
      </>
    );
  }
);

ExampleClientComponent1.displayName = "ExampleClientComponent1";

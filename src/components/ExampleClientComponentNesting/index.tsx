import { useAtom } from "jotai";
import { reactiveHydrate } from "reactive-hydration";
import { textState } from "state/textState";
import { ExampleClientComponent2 } from "components/ExampleClientComponent2";

export const ExampleClientComponentNesting = reactiveHydrate(
  {
    name: "ExampleClientComponentNesting",
    states: "textState",
  },
  () => {
    const [text] = useAtom(textState);

    return (
      <>
        <h4>ExampleClientComponentNesting</h4>
        <div>SERVER? {(typeof window !== "object").toString()}</div>
        <div>TEXT STATE: {text}</div>
        <div style={{ paddingLeft: 48 }}>
          (Nested...)
          <ExampleClientComponent2 />
          (...nested!)
        </div>
      </>
    );
  }
);

ExampleClientComponentNesting.displayName = "ExampleClientComponentNesting";

import { useRecoilState } from "recoil";
import { reactiveHydrate } from "reactive-hydration";
import { textState } from "state/textState";
import { ExampleClientComponent } from "components/ExampleClientComponent";
import { ExampleClientComponent1 } from "components/ExampleClientComponent1";
import { ExampleClientComponent2 } from "components/ExampleClientComponent2";

export const ExampleClientComponentNesting = reactiveHydrate(
  {
    name: "ExampleClientComponentNesting",
    states: "textState",
  },
  () => {
    const [text] = useRecoilState(textState);

    return (
      <>
        <h4>ExampleClientComponentNesting</h4>
        <div>TEXT STATE: {text}</div>
        <div style={{ paddingLeft: 48 }}>
          (Nested...)
          <ExampleClientComponent />
          <ExampleClientComponent1 />
          <ExampleClientComponent2 />
          (...nested!)
        </div>
      </>
    );
  }
);

ExampleClientComponentNesting.displayName = "ExampleClientComponentNesting";

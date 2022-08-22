import { useRecoilState } from "recoil";
import { reactiveHydrate } from "reactive-hydration";
import { textState } from "../../state/textState";
import { ExampleClientComponent } from "../ExampleClientComponent";
import { ExampleClientComponent1 } from "../ExampleClientComponent1";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";

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

        <div>recoil textState = {text}</div>

        <div
          style={{
            paddingLeft: 48,
            paddingTop: 12,
          }}
        >
          <ExampleClientComponent />

          <ExampleClientComponent1 />

          <ExampleClientComponent2 />
        </div>
      </>
    );
  }
);

ExampleClientComponentNesting.displayName = "ExampleClientComponentNesting";

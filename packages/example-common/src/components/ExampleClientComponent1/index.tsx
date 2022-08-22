import { useRecoilState } from "recoil";
import { reactiveHydrate } from "reactive-hydration";
import { textState } from "../../state/textState";

export const ExampleClientComponent1 = reactiveHydrate(
  {
    name: "ExampleClientComponent1",
    states: "textState",
  },
  () => {
    const [text] = useRecoilState(textState);

    return (
      <>
        <h4>ExampleClientComponent1</h4>

        <div>recoil textState = {text}</div>
      </>
    );
  }
);

ExampleClientComponent1.displayName = "ExampleClientComponent1";

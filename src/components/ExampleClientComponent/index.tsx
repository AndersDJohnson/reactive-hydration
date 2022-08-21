import { useRecoilState } from "recoil";
import { reactiveHydrate } from "reactive-hydration";
import { textState } from "state/textState";
import { text2State } from "state/text2State";

export const ExampleClientComponent = reactiveHydrate(
  {
    name: "ExampleClientComponent",
    states: "textState,text2State",
  },
  () => {
    const [text] = useRecoilState(textState);
    const [text2] = useRecoilState(text2State);

    return (
      <>
        <h4>ExampleClientComponent</h4>

        <div>recoil textState = {text}</div>
        <div>recoil text2State = {text2}</div>
      </>
    );
  }
);

ExampleClientComponent.displayName = "ExampleClientComponent";

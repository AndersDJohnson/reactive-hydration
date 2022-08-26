import { useRecoilState } from "recoil";
import { textState } from "../../state/textState";
import { ExampleClientComponent } from "../ExampleClientComponent";
import { ExampleClientComponent1 } from "../ExampleClientComponent1";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";

export const ExampleClientComponentNesting = () => {
  const [text] = useRecoilState(textState);

  return (
    <>
      <h4>ExampleClientComponentNesting</h4>

      <div>recoil textState = {text}</div>

      <button data-click>hydrate</button>

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
};

ExampleClientComponentNesting.displayName = "ExampleClientComponentNesting";
ExampleClientComponentNesting.states = "textState";

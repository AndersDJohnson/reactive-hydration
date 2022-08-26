import { useRecoilState } from "recoil";
import { textState } from "../../state/textState";
import { text2State } from "../../state/text2State";

export const ExampleClientComponent = () => {
  console.log(
    "*** Rendering ExampleClientComponent",
    ExampleClientComponent.toString()
  );

  const [text] = useRecoilState(textState);
  const [text2] = useRecoilState(text2State);

  return (
    <>
      <h4>ExampleClientComponent</h4>

      <div>recoil textState = {text}</div>
      <div>recoil text2State = {text2}</div>

      <button data-click>hydrate</button>
    </>
  );
};

ExampleClientComponent.displayName = "ExampleClientComponent";

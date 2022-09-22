import { useRecoilState } from "recoil";
import { textState } from "../../state/textState";
import { text2State } from "../../state/text2State";

interface ExampleClientComponentProps {
  testProp?: string;
}

export const ExampleClientComponent = (props: ExampleClientComponentProps) => {
  const { testProp } = props;

  const [text] = useRecoilState(textState);
  const [text2] = useRecoilState(text2State);

  return (
    <>
      <h4>ExampleClientComponent</h4>

      {testProp ? <div>testProp={testProp}</div> : null}

      <div>recoil textState = {text}</div>
      <div>recoil text2State = {text2}</div>

      <button data-click>hydrate</button>
    </>
  );
};

ExampleClientComponent.displayName = "ExampleClientComponent";
ExampleClientComponent.states = "textState,text2State";

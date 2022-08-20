import { useRecoilValue } from "recoil";
import { textState } from "../state/textState";
import { text2State } from "../state/text2State";

export const ExampleServerComponentInner = () => {
  const text = useRecoilValue(textState);
  const text2 = useRecoilValue(text2State);

  return (
    // This state metadata could perhaps be injected in a wrapper by the compiler...
    <div
      data-file="src/ExampleServerComponent/ExampleServerComponentInner.client"
      data-states="textState,textState2"
    >
      <div>SERVER? {(typeof window !== "object").toString()}</div>
      <div>TEXT STATE: {text}</div>
      <div>TEXT 2 STATE: {text2}</div>
    </div>
  );
};

ExampleServerComponentInner.displayName = "ExampleServerComponentInner";

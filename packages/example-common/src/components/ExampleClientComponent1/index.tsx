import { useCallback, useContext } from "react";
import { useRecoilState } from "recoil";
import { reactiveHydrate } from "reactive-hydration";
import { textState } from "../../state/textState";
import { MyContext } from "../MyContext";

export const ExampleClientComponent1 = reactiveHydrate(
  {
    name: "ExampleClientComponent1",
    states: "textState",
  },
  () => {
    const [text] = useRecoilState(textState);

    const { message, setMessage } = useContext(MyContext);

    const handleClickContextSetMessage = useCallback(() => {
      setMessage(`message: ${Math.random()}`);
    }, [setMessage]);

    return (
      <>
        <h4>ExampleClientComponent1</h4>

        <div>recoil textState = {text}</div>

        <div>context message = {message}</div>

        <button data-click onClick={handleClickContextSetMessage}>
          context setMessage (error)
        </button>

        <button data-click>hydrate</button>
      </>
    );
  }
);

ExampleClientComponent1.displayName = "ExampleClientComponent1";

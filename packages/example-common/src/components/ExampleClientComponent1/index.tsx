import { useCallback } from "react";
import { useRecoilState } from "recoil";
import {
  reactiveHydrate,
  useContextReactiveHydration,
} from "reactive-hydration";
import { textState } from "../../state/textState";
import { MyContext } from "../MyContext";

export const ExampleClientComponent1 = reactiveHydrate(
  {
    name: "ExampleClientComponent1",
    states: "textState",
    contexts: "MyContext",
  },
  () => {
    const [text] = useRecoilState(textState);

    // TODO: Replace this with runtime monkeypatch of React module.
    const { message, setMessage } = useContextReactiveHydration(MyContext);

    const handleClickContextSetMessage = useCallback(() => {
      setMessage(`message: ${Math.random()}`);
    }, [setMessage]);

    return (
      <>
        <h4>ExampleClientComponent1</h4>

        <div>recoil textState = {text}</div>

        <div>context message = {message}</div>

        <button data-click onClick={handleClickContextSetMessage}>
          context setMessage
        </button>

        <button data-click>hydrate</button>
      </>
    );
  }
);

ExampleClientComponent1.displayName = "ExampleClientComponent1";

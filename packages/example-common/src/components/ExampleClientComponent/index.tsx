import { useContext } from "react";
import { useRecoilState } from "recoil";
import {
  ReactiveHydrationContainerContext,
  ReactiveHydrationInnardsContext,
} from "reactive-hydration";
import { textState } from "../../state/textState";
import { text2State } from "../../state/text2State";

export const ExampleClientComponent = (props: any) => {
  const reactiveHydrationContainerContext = useContext(
    ReactiveHydrationContainerContext
  );

  console.log("*** ExampleClientComponent props.debug", props.debug);

  const reactiveHydrationInnardsContext =
    useContext(ReactiveHydrationInnardsContext) ?? {};

  console.log("*** ExampleClientComponent contexts", {
    reactiveHydrationContainerContext,
    reactiveHydrationInnardsContext,
  });

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

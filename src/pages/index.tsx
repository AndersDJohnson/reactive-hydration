import type { NextPage } from "next";
import { useCallback } from "react";
import { useAtom } from "jotai";
import { ReactiveHydrationContainer } from "reactive-hydration";
import { textState } from "../state/textState";
import { text2State } from "../state/text2State";
import { ExampleServerComponent } from "../components/ExampleServerComponent";

const Home: NextPage = () => {
  const [, setText] = useAtom(textState);

  const handleClick = useCallback(() => {
    setText(`(client value: ${Math.random()}`);
  }, [setText]);

  const [, setText2] = useAtom(text2State);

  const handleClick2 = useCallback(() => {
    setText2(`(client value: ${Math.random()}`);
  }, [setText2]);

  return (
    <div>
      <button onClick={handleClick}>Update text on client</button>
      <button onClick={handleClick2}>Update text 2 on client</button>

      {/* This wrapper could be generated by a compiler when we import `ExampleServerComponent`. */}
      <ReactiveHydrationContainer Comp={ExampleServerComponent} />
    </div>
  );
};

export default Home;

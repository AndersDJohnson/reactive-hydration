import type { NextPage } from "next";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { ServerComponent } from "../ServerComponent";
import { textState } from "../state/textState";

const Home: NextPage = () => {
  const setText = useSetRecoilState(textState);

  const handleClick = useCallback(() => {
    setText("(client value)");
  }, [setText]);

  return (
    <div>
      <button onClick={handleClick}>Update text on client</button>
      <ServerComponent />
    </div>
  );
};

export default Home;

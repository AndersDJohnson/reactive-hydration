import type { NextPage } from "next";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { ServerComponent } from "../ServerComponent";
import { shouldLoadState } from "../state/shouldLoad";

const Home: NextPage = () => {
  const setShouldLoad = useSetRecoilState(shouldLoadState);

  const handleClick = useCallback(() => {
    setShouldLoad(true);
  }, [setShouldLoad]);

  return (
    <div>
      <button onClick={handleClick}>Load</button>
      <ServerComponent />
    </div>
  );
};

export default Home;

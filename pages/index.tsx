import type { NextPage } from "next";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { ServerComponent } from "./components/ServerComponent";
import { shouldLoadState } from "./state/shouldLoad";

const Home: NextPage = () => {
  const [, setShouldLoad] = useRecoilState(shouldLoadState);

  return (
    <div>
      <button onClick={() => setShouldLoad(true)}>Load</button>
      <ServerComponent />
    </div>
  );
};

export default Home;

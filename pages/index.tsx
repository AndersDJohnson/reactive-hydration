import type { NextPage } from "next";
import { useState } from "react";
import { ServerComponent } from "./components/ServerComponent";

const Home: NextPage = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  return (
    <div>
      <button onClick={() => setShouldLoad(true)}>Load</button>
      <ServerComponent shouldLoad={shouldLoad} />
    </div>
  );
};

export default Home;

import type { NextPage } from "next";
import Link from "next/link";
import { ExampleClientSetterButtonsDynamic } from "components/ExampleClientSetterButtons/dynamic";
import { MyReactiveHydrationContainer } from "components/MyReactiveHydrationContainer";

const Home: NextPage = () => {
  return (
    <div>
      <h1>Home Page</h1>

      <nav>
        <Link href="/other">Other Page</Link>
      </nav>

      <ExampleClientSetterButtonsDynamic />

      <MyReactiveHydrationContainer />
    </div>
  );
};

export default Home;

import type { NextPage } from "next";
import Link from "next/link";
import { ExampleClientSetterButtonsDynamic } from "components/ExampleClientSetterButtons/dynamic";
import { MyReactiveHydrationContainer } from "components/MyReactiveHydrationContainer";

const Other: NextPage = () => {
  return (
    <div>
      <h1>Other Page</h1>

      <nav>
        <Link href="/">Home Page</Link>
      </nav>

      <ExampleClientSetterButtonsDynamic />

      <MyReactiveHydrationContainer />
    </div>
  );
};

export default Other;

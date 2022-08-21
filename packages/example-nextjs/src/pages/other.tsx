import type { NextPage } from "next";
import Link from "next/link";
import { RecoilStateSetterButtonsDynamic } from "components/RecoilStateSetterButtons/dynamic";
import { MyReactiveHydrationContainer } from "components/MyReactiveHydrationContainer";

const Other: NextPage = () => {
  return (
    <div>
      <h1>Other Page</h1>

      <nav>
        <Link href="/">Home Page</Link>
      </nav>

      <RecoilStateSetterButtonsDynamic />

      <MyReactiveHydrationContainer />
    </div>
  );
};

export default Other;

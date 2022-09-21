import type { NextPage } from "next";
import Link from "next/link";
import { ExampleClientSetterButtonsDynamic } from "components/ExampleClientSetterButtons/dynamic";
import { MyReactiveHydrationContainer } from "components/MyReactiveHydrationContainer";

const Home: NextPage = () => {
  return (
    <div>
      <h1>Home Page</h1>

      <nav>
        <Link href="/other">Other Page (SPA)</Link>{" "}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/other">Other Page (MPA)</a>
      </nav>

      <ExampleClientSetterButtonsDynamic />

      <MyReactiveHydrationContainer />
    </div>
  );
};

export default Home;

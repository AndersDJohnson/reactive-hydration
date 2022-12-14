import type { NextPage } from "next";
import Link from "next/link";
import { ExampleClientSetterButtonsDynamic } from "components/ExampleClientSetterButtons/dynamic";
import { MyReactiveHydrationContainer } from "components/MyReactiveHydrationContainer";

const Other: NextPage = () => {
  return (
    <div>
      <h1>Other Page</h1>

      <nav>
        <Link href="/">Home Page (SPA)</Link>{" "}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">Home Page (MPA)</a>
      </nav>

      <ExampleClientSetterButtonsDynamic />

      <MyReactiveHydrationContainer />
    </div>
  );
};

// Disable Automatic Static Optimization: https://nextjs.org/docs/advanced-features/automatic-static-optimization
Other.getInitialProps = async () => ({});

export default Other;

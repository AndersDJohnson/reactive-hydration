import { ComponentType } from "react";
import { ReactiveHydrationContainer } from "reactive-hydration";
import { ExampleServerComponentDynamic } from "components/ExampleServerComponent/dynamic";

const importComponent = (component: string) =>
  import("reactive-hydration-example-common").then(
    (mod) => mod[component] as ComponentType<unknown>
  );

export const MyReactiveHydrationContainer = () => (
  <ReactiveHydrationContainer
    importComponent={importComponent}
    Comp={ExampleServerComponentDynamic}
    LazyComp={ExampleServerComponentDynamic}
  />
);

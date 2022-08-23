import { ComponentType, Context } from "react";
import { ReactiveHydrationContainer } from "reactive-hydration";
import { ExampleServerComponentDynamic } from "components/ExampleServerComponent/dynamic";

const importComponent = (component: string) =>
  import("reactive-hydration-example-common").then(
    (mod) => mod[component] as ComponentType<unknown>
  );

const importContext = (context: string) =>
  import("reactive-hydration-example-common").then(
    (mod) => mod[context] as Context<unknown>
  );

export const MyReactiveHydrationContainer = () => (
  <ReactiveHydrationContainer
    importComponent={importComponent}
    importContext={importContext}
    Comp={ExampleServerComponentDynamic}
    LazyComp={ExampleServerComponentDynamic}
  />
);

import { ComponentType } from "react";
import {
  ContextWithDefaultValues,
  ReactiveHydrationContainer,
} from "reactive-hydration";
import * as reactiveHydration from "reactive-hydration";
import { ExampleServerComponentDynamic } from "components/ExampleServerComponent/dynamic";

const importComponent = (component: string) =>
  import("reactive-hydration-example-common").then(
    (mod) => mod[component] as ComponentType<unknown>
  );

const importContext = (context: string) =>
  import("reactive-hydration-example-common").then(
    (mod) => mod[context] as ContextWithDefaultValues<unknown>
  );

export const MyReactiveHydrationContainer = () => {
  console.log("*** reactiveHydration", reactiveHydration);
  console.log("*** ReactiveHydrationContainer", ReactiveHydrationContainer);

  return (
    <ReactiveHydrationContainer
      importComponent={importComponent}
      importContext={importContext}
      Comp={ExampleServerComponentDynamic}
      LazyComp={ExampleServerComponentDynamic}
    />
  );
};

MyReactiveHydrationContainer.displayName = "MyReactiveHydrationContainer";

import { ComponentType } from "react";
import {
  ContextWithDefaultValues,
  ReactiveHydrationContainer,
} from "reactive-hydration";
import {
  ExampleServerComponent,
  ExampleServerComponentLoader,
} from "reactive-hydration-example-common";

const importComponent = (component: string) =>
  import("reactive-hydration-example-common").then(
    (mod) => mod[component] as ComponentType<unknown>
  );

const importContext = (context: string) =>
  import("reactive-hydration-example-common").then(
    (mod) => mod[context] as ContextWithDefaultValues<unknown>
  );

export const MyReactiveHydrationContainer = () => (
  <ReactiveHydrationContainer
    importComponent={importComponent}
    importContext={importContext}
    // TODO: Do we want a statically imported version here? Tree-shake from build somehow?
    Comp={ExampleServerComponent}
    LazyComp={ExampleServerComponentLoader}
  />
);

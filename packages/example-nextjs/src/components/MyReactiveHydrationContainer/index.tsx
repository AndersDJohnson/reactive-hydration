import { ComponentType } from "react";
import {
  ContextWithDefaultValues,
  ReactiveHydrationContainer,
} from "reactive-hydration";
import { ExampleServerComponentDynamic } from "components/ExampleServerComponent/dynamic";

const importComponent = (component: string) =>
  import(
    /* webpackChunkName: "component-[request]" */
    /* webpackInclude: /\.js$/ */
    `reactive-hydration-example-common/dist/components/${component}`
  ).then((mod) => mod[component] as ComponentType<unknown>);

const importContext = (context: string) =>
  import(
    /* webpackChunkName: "context-[request]" */
    /* webpackInclude: /\.js$/ */
    `reactive-hydration-example-common/dist/contexts/${context}`
  ).then((mod) => mod[context] as ContextWithDefaultValues<unknown>);

export const MyReactiveHydrationContainer = () => (
  <ReactiveHydrationContainer
    importComponent={importComponent}
    importContext={importContext}
    Comp={ExampleServerComponentDynamic}
    LazyComp={ExampleServerComponentDynamic}
  />
);

MyReactiveHydrationContainer.displayName = "MyReactiveHydrationContainer";

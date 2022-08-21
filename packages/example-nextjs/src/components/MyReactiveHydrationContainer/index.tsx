import { ReactiveHydrationContainer } from "reactive-hydration";
import { ExampleServerComponentDynamic } from "components/ExampleServerComponent/dynamic";

const importComponent = (component: string) =>
  import(`../${component}`).then((mod) => mod[component]);

export const MyReactiveHydrationContainer = () => (
  <ReactiveHydrationContainer
    importComponent={importComponent}
    Comp={ExampleServerComponentDynamic}
    LazyComp={ExampleServerComponentDynamic}
  />
);

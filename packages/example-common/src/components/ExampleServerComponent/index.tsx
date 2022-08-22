import { ExampleClientComponent } from "../ExampleClientComponent";
import { ExampleClientComponent1 } from "../ExampleClientComponent1";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";
import { ExampleClientComponentNesting } from "../ExampleClientComponentNesting";

export const ExampleServerComponent = () => {
  console.debug(
    "Rendering ExampleServerComponent (should be on server only on initial page load, but may be loaded on client after routing)"
  );

  return (
    <>
      <ExampleClientComponent />

      <ExampleClientComponent />

      <ExampleClientComponent1 />

      <ExampleClientComponent2 />

      <ExampleClientComponentNesting />
    </>
  );
};

ExampleServerComponent.displayName = "ExampleServerComponent";

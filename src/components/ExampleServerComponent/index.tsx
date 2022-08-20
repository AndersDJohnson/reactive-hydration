import { ExampleClientComponent } from "../ExampleClientComponent";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";
import { ExampleClientComponentNesting } from "../ExampleClientComponentNesting";

export const ExampleServerComponent = () => {
  console.debug("Rendering ExampleServerComponent (should be on server only)");

  return (
    <>
      <div>(Wrapper...)</div>
      <ExampleClientComponent />
      <ExampleClientComponent />
      <ExampleClientComponent2 />
      <ExampleClientComponentNesting />
      <div>(...wrapper!)</div>
    </>
  );
};

ExampleServerComponent.displayName = "ExampleServerComponent";

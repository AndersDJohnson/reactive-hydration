import { ExampleClientComponent } from "../ExampleClientComponent";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";
import { ExampleClientComponentNested } from "../ExampleClientComponentNested";

export const ExampleServerComponent = () => {
  console.log("rendering ExampleServerComponent (should be on server only)");

  return (
    <>
      <div>(Wrapper...)</div>
      <ExampleClientComponent />
      <ExampleClientComponent />
      <ExampleClientComponent2 />
      <ExampleClientComponentNested />
      <div>(...wrapper!)</div>
    </>
  );
};

ExampleServerComponent.displayName = "ExampleServerComponent";

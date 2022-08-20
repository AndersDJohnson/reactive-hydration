import { ExampleClientComponent } from "../ExampleClientComponent";
import { ExampleClientComponent1 } from "../ExampleClientComponent1";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";
import { ExampleClientComponentNesting } from "../ExampleClientComponentNesting";

console.log("*** typeof window", typeof window);

export const ExampleServerComponent = () => {
  console.debug("Rendering ExampleServerComponent (should be on server only)");

  return (
    <>
      <div>(Wrapper...)</div>
      <ExampleClientComponent />
      <ExampleClientComponent />
      <ExampleClientComponent1 />
      <ExampleClientComponent2 />
      <ExampleClientComponentNesting />
      <div>(...wrapper!)</div>
    </>
  );
};

ExampleServerComponent.displayName = "ExampleServerComponent";

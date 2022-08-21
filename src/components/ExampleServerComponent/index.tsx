import { ExampleClientComponent } from "components/ExampleClientComponent";
import { ExampleClientComponent1 } from "components/ExampleClientComponent1";
import { ExampleClientComponent2 } from "components/ExampleClientComponent2";
import { ExampleClientComponentNesting } from "components/ExampleClientComponentNesting";

export const ExampleServerComponent = () => {
  console.debug(
    "Rendering ExampleServerComponent (should be on server only on initial page load, but may be loaded on client after routing)"
  );

  return (
    <>
      <div>(Wrapper...)</div>
      {/* <ExampleClientComponent />
      <ExampleClientComponent />
      <ExampleClientComponent1 />
      <ExampleClientComponent2 /> */}
      <ExampleClientComponentNesting />
      <div>(...wrapper!)</div>
    </>
  );
};

ExampleServerComponent.displayName = "ExampleServerComponent";

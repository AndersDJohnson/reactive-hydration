import { ExampleClientComponent } from "../ExampleClientComponent";

export const ExampleServerComponent = () => {
  console.log(
    "*** rendering ExampleServerComponent (should be on server only)"
  );

  return (
    <>
      <div>(Wrapper...)</div>
      <ExampleClientComponent />
      <ExampleClientComponent />
      <div>(...wrapper!)</div>
    </>
  );
};

ExampleServerComponent.displayName = "ExampleServerComponent";

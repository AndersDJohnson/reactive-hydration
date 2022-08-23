import { useMemo, useState } from "react";
import { ContextSerialized } from "reactive-hydration";
import { ExampleClientComponent } from "../ExampleClientComponent";
import { ExampleClientComponent1 } from "../ExampleClientComponent1";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";
import { ExampleClientComponentNesting } from "../ExampleClientComponentNesting";
import { MyContext } from "../MyContext";

export const ExampleServerComponent = () => {
  console.debug(
    "Rendering ExampleServerComponent (should be on server only on initial page load, but may be loaded on client after routing)"
  );

  const [message, setMessage] = useState(`initial ${Math.random()}`);

  const myContextValue = useMemo(
    () => ({
      message,
      setMessage,
    }),
    [message, setMessage]
  );

  return (
    <ContextSerialized
      context={MyContext}
      name="MyContext"
      value={myContextValue}
    >
      <ExampleClientComponent />

      <ExampleClientComponent />

      <ExampleClientComponent1 />

      <ExampleClientComponent2 />

      <ExampleClientComponentNesting />
    </ContextSerialized>
  );
};

ExampleServerComponent.displayName = "ExampleServerComponent";

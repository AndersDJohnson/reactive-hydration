import { useMemo, useState } from "react";
import { createContextWithDefaultValue } from "reactive-hydration";
import { ExampleClientComponent } from "../ExampleClientComponent";
import { ExampleClientComponent1 } from "../ExampleClientComponent1";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";
import { ExampleClientComponentNesting } from "../ExampleClientComponentNesting";
import { MyContext } from "../MyContext";

const DummyContext = createContextWithDefaultValue(
  "DummyContext",
  {},
  (props) => {
    return (
      <props.Provider value={props.serializedValue}>
        {props.children}
      </props.Provider>
    );
  }
);

export const ExampleServerComponent = () => {
  console.debug(
    "Rendering ExampleServerComponent (should be on server only on initial page load, but may be loaded on client after routing)"
  );

  const [message, setMessage] = useState(`initial ${Math.random()}`);

  const myContextValue = useMemo(
    () => ({
      __id: Math.random().toString(),
      message,
      setMessage,
    }),
    [message, setMessage]
  );

  return (
    <div>
      <div style={{ border: "1px solid gray", padding: 4, margin: 4 }}>
        <div>Inside of MyContext:</div>

        <MyContext.Provider value={myContextValue}>
          <ExampleClientComponent />

          <ExampleClientComponent />

          <ExampleClientComponent1 />

          <ExampleClientComponent2 />

          <ExampleClientComponentNesting />

          {/* Just to test context tree walk order. */}
          <DummyContext.Provider value={myContextValue} />
        </MyContext.Provider>

        {/* Just to test context tree walk order. */}
        <DummyContext.Provider value={myContextValue} />
      </div>

      <div style={{ border: "1px solid gray", padding: 4, margin: 4 }}>
        <div>Separate MyContext:</div>

        <MyContext.Provider value={myContextValue}>
          <ExampleClientComponent1 />
        </MyContext.Provider>
      </div>

      <div style={{ border: "1px solid gray", padding: 4, margin: 4 }}>
        <div>No MyContext (setting message is a no-op here):</div>

        <ExampleClientComponent1 />
      </div>
    </div>
  );
};

ExampleServerComponent.displayName = "ExampleServerComponent";

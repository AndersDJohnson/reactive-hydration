import { useMemo, useState } from "react";
import {
  ContextSerialized,
  createContextWithDefaultValue,
} from "reactive-hydration";
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
      <props.Context.Provider value={props.serializedValue}>
        {props.children}
      </props.Context.Provider>
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
      message,
      setMessage,
    }),
    [message, setMessage]
  );

  return (
    <div>
      <div style={{ border: "1px solid gray", padding: 4, margin: 4 }}>
        <div>Inside of MyContext:</div>

        {/* TODO: Replace this with runtime monkeypatch of React module. */}
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

          {/* Just to test context tree walk order. */}
          <ContextSerialized
            context={DummyContext}
            name="DummyContext"
            value={myContextValue}
          />
        </ContextSerialized>

        {/* Just to test context tree walk order. */}
        <ContextSerialized
          context={DummyContext}
          name="DummyContext"
          value={myContextValue}
        />
      </div>

      <div style={{ border: "1px solid gray", padding: 4, margin: 4 }}>
        <div>Separate MyContext:</div>

        <ContextSerialized
          context={MyContext}
          name="MyContext"
          value={myContextValue}
        >
          <ExampleClientComponent1 />
        </ContextSerialized>
      </div>
    </div>
  );
};

ExampleServerComponent.displayName = "ExampleServerComponent";

import { useContext, useMemo, useState } from "react";
import {
  createContextWithDefaultValue,
  ReactiveHydrationContainerContext,
  ReactiveHydrationInnardsContext,
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
    const { Provider, children } = props;

    const value = useMemo(() => ({}), []);

    return <Provider value={value}>{children}</Provider>;
  }
);

export const ExampleServerComponent = () => {
  console.debug(
    "Rendering ExampleServerComponent (should be on server only on initial page load, but may be loaded on client after routing)",
    "ExampleClientComponent",
    ExampleClientComponent.displayName,
    ExampleClientComponent
  );

  const reactiveHydrationContainerContext = useContext(
    ReactiveHydrationContainerContext
  );

  const reactiveHydrationInnardsContext =
    useContext(ReactiveHydrationInnardsContext) ?? {};

  console.log("*** ExampleServerComponent contexts", {
    "ReactiveHydrationContainerContext.id":
      // @ts-ignore
      ReactiveHydrationContainerContext.id,
    reactiveHydrationContainerContext,
    reactiveHydrationInnardsContext,
  });

  const [message, setMessage] = useState(`initial ${Math.random()}`);

  const myContextValue = useMemo(
    () => ({
      message,
      setMessage,
    }),
    [message, setMessage]
  );

  const dummyContextValue = useMemo(() => ({}), []);

  return (
    <div>
      <ExampleClientComponent />

      <div style={{ border: "1px solid gray", padding: 4, margin: 4 }}>
        <div>Inside of MyContext:</div>

        <MyContext.Provider value={myContextValue}>
          <ExampleClientComponent />

          <ExampleClientComponent />

          <ExampleClientComponent1 />

          <ExampleClientComponent2 />

          <ExampleClientComponentNesting />

          {/* Just to test context tree walk order. */}
          <DummyContext.Provider value={dummyContextValue} />
        </MyContext.Provider>

        {/* Just to test context tree walk order. */}
        <DummyContext.Provider value={dummyContextValue} />
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

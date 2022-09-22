import { Suspense, useMemo, useState } from "react";
import { createContextWithDefaultValue } from "reactive-hydration";
import { ExampleClientComponent } from "../ExampleClientComponent";
import { ExampleClientComponent1 } from "../ExampleClientComponent1";
import { ExampleClientComponent2 } from "../ExampleClientComponent2";
import { ExampleClientComponentNesting } from "../ExampleClientComponentNesting";
import { ExampleClientComponentSuspense } from "../ExampleClientComponentSuspense";
import { MyContext } from "../../contexts/MyContext";

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
  // const [message, setMessage] = useState(`initial ${Math.random()}`);
  const [message, setMessage] = useState(`initial 1`);

  const myContextValue = useMemo(
    () => ({
      message,
      setMessage,
    }),
    [message, setMessage]
  );

  // const [message2, setMessage2] = useState(`initial ${Math.random()}`);
  const [message2, setMessage2] = useState(`initial 2`);

  const myContext2Value = useMemo(
    () => ({
      message: message2,
      setMessage: setMessage2,
    }),
    [message2, setMessage2]
  );

  const dummyContextValue = useMemo(() => ({}), []);

  return (
    <div>
      <ExampleClientComponent />

      <div style={{ border: "1px solid gray", padding: 4, margin: 4 }}>
        <div>Inside of MyContext:</div>

        <MyContext.Provider value={myContextValue}>
          <ExampleClientComponent />

          <ExampleClientComponent testProp="Hi, I'm a test prop!" />

          <ExampleClientComponent1 />

          <ExampleClientComponent2 />

          <Suspense
            fallback={<div>Loading ExampleClientComponentSuspense...</div>}
          >
            <ExampleClientComponentSuspense />
          </Suspense>

          <ExampleClientComponentNesting />

          {/* Just to test context tree walk order. */}
          <DummyContext.Provider value={dummyContextValue} />
        </MyContext.Provider>

        {/* Just to test context tree walk order. */}
        <DummyContext.Provider value={dummyContextValue} />
      </div>

      <div style={{ border: "1px solid gray", padding: 4, margin: 4 }}>
        <div>Separate MyContext (but same source value):</div>

        <MyContext.Provider value={myContextValue}>
          <ExampleClientComponent1 />
        </MyContext.Provider>
      </div>

      <div style={{ border: "1px solid gray", padding: 4, margin: 4 }}>
        <div>Separate MyContext (and different source value):</div>

        <MyContext.Provider value={myContext2Value}>
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

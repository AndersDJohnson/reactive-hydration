import { useState } from "react";
import { makeResourceFromPromise } from "./makeResourceFromPromise";

export const ExampleClientComponentSuspense = () => {
  const [resource] = useState(() =>
    makeResourceFromPromise(
      new Promise<string>((resolve) =>
        setTimeout(() => resolve("hello"), 10000)
      )
    )
  );

  const value = resource();

  return (
    <>
      <h4>ExampleClientComponentSuspense</h4>

      <div>value = {value}</div>

      <button data-click>hydrate</button>
    </>
  );
};

ExampleClientComponentSuspense.displayName = "ExampleClientComponentSuspense";

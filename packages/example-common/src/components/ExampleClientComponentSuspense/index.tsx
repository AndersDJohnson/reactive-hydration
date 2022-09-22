import { useState } from "react";
import { makeResourceFromPromise } from "./makeResourceFromPromise";

const resource = makeResourceFromPromise(
  (data: string) =>
    new Promise<string>((resolve) => setTimeout(() => resolve(data), 2000))
);

export const ExampleClientComponentSuspense = () => {
  const [data] = useState(() => Math.random().toString());

  const value = resource(data);

  return (
    <>
      <h4>ExampleClientComponentSuspense</h4>

      <div>value = {value}</div>

      <button data-click>hydrate</button>
    </>
  );
};

ExampleClientComponentSuspense.reactiveHydrateSkip = true;

ExampleClientComponentSuspense.displayName = "ExampleClientComponentSuspense";

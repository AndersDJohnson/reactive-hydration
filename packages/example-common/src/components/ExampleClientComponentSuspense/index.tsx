import { makeResourceFromPromise } from "./makeResourceFromPromise";

const resource = makeResourceFromPromise(
  new Promise<string>((resolve) => setTimeout(() => resolve("hello"), 2000))
);

export const ExampleClientComponentSuspense = () => {
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

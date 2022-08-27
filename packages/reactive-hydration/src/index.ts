export { reactiveHydrate } from "./ReactiveHydrate";
export { createContextWithDefaultValue } from "./createContextWithDefaultValue";
export type { ContextWithDefaultValues } from "./createContextWithDefaultValue";
export { registerState } from "./stateRegistry";
export { ReactiveHydrationContainer } from "./ReactiveHydrationContainer";
// TODO: Do we really need to export this?
export { ReactiveHydrateContextProvider } from "./ReactiveHydrateContext";
export { ReactiveHydrationContainerContext } from "./ReactiveHydrationContainerContext";
export { ReactiveHydrationInnardsContext } from "./ReactiveHydrationInnardsContext";

export const id = Math.random();

if (typeof global !== "undefined") {
  // @ts-expect-error
  if (global.ReactiveHydrationSingleton) {
    // // setter error
    // Object.assign(
    //   exports,
    //   // @ts-expect-error
    //   global.ReactiveHydrationSingleton
    // );

    module.exports =
      // @ts-expect-error
      global.ReactiveHydrationSingleton;

    console.log(
      "*** reactive-hydration reused existing singleton",
      // @ts-expect-error
      global.ReactiveHydrationSingleton.id,
      new Error("ok")
    );
  } else {
    // @ts-expect-error
    global.ReactiveHydrationSingleton = exports;

    console.log("*** reactive-hydration instantiated by", id, new Error("ok"));
  }
}

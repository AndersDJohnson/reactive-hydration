export { reactiveHydrate } from "./ReactiveHydrate";
export { createContextWithDefaultValue } from "./createContextWithDefaultValue";
export type { ContextWithDefaultValues } from "./createContextWithDefaultValue";
export { registerState } from "./stateRegistry";
export { ReactiveHydrationContainer } from "./ReactiveHydrationContainer";
// TODO: Do we really need to export this?
export { ReactiveHydrateContextProvider } from "./ReactiveHydrateContext";
export { ReactiveHydrationContainerContext } from "./ReactiveHydrationContainerContext";
export { ReactiveHydrationInnardsContext } from "./ReactiveHydrationInnardsContext";

if (typeof global !== "undefined") {
  // @ts-expect-error
  if (global.ReactiveHydrationSingleton) {
    module.exports =
      // @ts-expect-error
      global.ReactiveHydrationSingleton;
  } else {
    // @ts-expect-error
    global.ReactiveHydrationSingleton = exports;
  }
}

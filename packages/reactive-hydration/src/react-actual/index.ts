import type { Context } from "_react";

const React: typeof import("_react") =
  typeof window !== "undefined" && window.React
    ? window.React
    : require("_react");

console.log(
  "*** reactive-hydration react-actual React.id",
  // @ts-expect-error Just for debugging
  React.id
);

if (typeof window !== "undefined") {
  window.React = window.React || React;
}

const {
  useState: useStateActual,
  useContext: useContextActual,
  useCallback,
  useRef,
} = React;

export const useState = <S>(init: S | (() => S)) =>
  useStateActual(
    init,
    // @ts-expect-error The bypass argument is checked in our `jsx-runtime` monkeypatches.
    true
  );

export const useContext = <T>(context: Context<T>) =>
  useContextActual(
    context,
    // @ts-expect-error The bypass argument is checked in our `jsx-runtime` monkeypatches.
    true
  );

export { useCallback, useRef };

export default React;

module.exports = React;

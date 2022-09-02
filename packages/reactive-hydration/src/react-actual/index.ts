import type { Context } from "_react";
import {
  useState as useStateMonkeypatchImport,
  useContext as useContextMonkeypatchImport,
} from "_react";

const useStateMonkeypatch = useStateMonkeypatchImport;
const useContextMonkeypatch = useContextMonkeypatchImport;

// const React: typeof import("_react") =
//   typeof window !== "undefined" && window.React
//     ? window.React
//     : require("_react");

// console.log(
//   "*** reactive-hydration react-actual React.id",
//   // @ts-expect-error Just for debugging
//   React.id
// );

// if (typeof window !== "undefined") {
//   window.React = window.React || React;
// }

// const {
//   useState: useStateActual,
//   useContext: useContextActual,
//   // useCallback,
//   // useRef,
// } = React;

export const useState = <S>(init: S | (() => S)) => {
  console.log("*** useStateActual");

  return useStateMonkeypatch(
    init,
    // @ts-expect-error The bypass argument is checked in our `jsx-runtime` monkeypatches.
    true
  );
};

export const useContext = <T>(context: Context<T>) => {
  console.log("*** useContextActual");

  return useContextMonkeypatch(
    context,
    // @ts-expect-error The bypass argument is checked in our `jsx-runtime` monkeypatches.
    true
  );
};

// For a time we were considering only importing from `react-actual` in this whole module, so other exports were needed. But it seemed to override `useState` wrapper above.
// export { useCallback, useRef };
// export default React;

// module.exports = React;

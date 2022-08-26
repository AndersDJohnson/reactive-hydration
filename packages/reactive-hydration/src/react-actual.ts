import {
  // ComponentType,
  // ReactNode,
  Context,
  // e slint-disable-next-line no-restricted-imports -- Use the real one in this monkeypatch.
  // createElement as createElementMonkeypatched,
  // eslint-disable-next-line no-restricted-imports -- Use the real one in this monkeypatch.
  useState as useStateMonkeypatched,
  // eslint-disable-next-line no-restricted-imports -- Use the real one in this monkeypatch.
  useContext as useContextMonkeypatched,
} from "react";
import { bypassMonkeypatchSymbol } from "./bypassMonkeypatchSymbol";

// export const createElement = <P>(
//   type:
//     | string
//     | (ComponentType<P> & {
//         states?: string;
//       }),
//   props: P,
//   ...children: ReactNode[]
// ) =>
//   createElementMonkeypatched(
//     type,
//     props,
//     ...children,
//     // @ts-expect-error Bypass monkeypatch.
//     bypassMonkeypatchSymbol
//   );

export const useState = <S>(init: S | (() => S)) =>
  useStateMonkeypatched(
    init,
    // @ts-expect-error Bypass monkeypatch.
    bypassMonkeypatchSymbol
  );

export const useContext = <T>(context: Context<T>) =>
  useContextMonkeypatched(
    context,
    // @ts-expect-error Bypass monkeypatch.
    bypassMonkeypatchSymbol
  );

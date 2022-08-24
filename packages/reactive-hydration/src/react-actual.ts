import {
  Context,
  // eslint-disable-next-line no-restricted-imports -- We'll use the real one in this monkeypatch.
  useState as useStateMonkeypatched,
  // eslint-disable-next-line no-restricted-imports -- We'll use the real one in this monkeypatch.
  useContext as useContextMonkeypatched,
} from "react";

export const useState = <S>(init: S | (() => S)) =>
  useStateMonkeypatched<S>(
    init,
    // @ts-expect-error Bypass monkeypatch.
    true
  );

export const useContext = <T>(context: Context<T>) =>
  useContextMonkeypatched<T>(
    context,
    // @ts-expect-error Bypass monkeypatch.
    true
  );

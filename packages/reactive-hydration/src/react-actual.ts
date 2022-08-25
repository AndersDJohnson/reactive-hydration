import {
  Context,
  // eslint-disable-next-line no-restricted-imports -- Use the real one in this monkeypatch.
  useState as useStateMonkeypatched,
  // eslint-disable-next-line no-restricted-imports -- Use the real one in this monkeypatch.
  useContext as useContextMonkeypatched,
} from "react";

export const useState = <S>(init: S | (() => S)) =>
  useStateMonkeypatched(
    init,
    // @ts-expect-error Bypass monkeypatch.
    true
  );

export const useContext = <T>(context: Context<T>) =>
  useContextMonkeypatched(
    context,
    // @ts-expect-error Bypass monkeypatch.
    true
  );

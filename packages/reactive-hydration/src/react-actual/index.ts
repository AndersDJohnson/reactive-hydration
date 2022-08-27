import {
  useState as useStateActual,
  useContext as useContextActual,
  Context,
} from "_react";

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

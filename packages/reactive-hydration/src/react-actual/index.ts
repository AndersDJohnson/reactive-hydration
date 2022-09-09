import type { Context } from "react-actual";
import {
  useState as useStateActual,
  useContext as useContextActual,
} from "react-actual";

const useStateActualReference = useStateActual;
const useContextActualReference = useContextActual;

export const useState = <S>(init: S | (() => S)) =>
  useStateActualReference(
    init,
    // @ts-expect-error The bypass argument is checked in our `jsx-runtime` monkeypatches.
    true
  );

export const useContext = <T>(context: Context<T>) =>
  useContextActualReference(
    context,
    // @ts-expect-error The bypass argument is checked in our `jsx-runtime` monkeypatches.
    true
  );

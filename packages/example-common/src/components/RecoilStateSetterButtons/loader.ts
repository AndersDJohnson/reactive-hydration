import { lazy } from "react";

export const RecoilStateSetterButtonsLoader = lazy(() =>
  import(/* webpackChunkName: "RecoilStateSetterButtonsLoader" */ ".").then(
    (mod) => ({
      default: mod.RecoilStateSetterButtons,
    })
  )
);

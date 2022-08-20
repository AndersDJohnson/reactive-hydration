import { lazy } from "react";

export const ExampleServerComponentLoader = lazy(() =>
  import(/* webpackChunkName: "ExampleServerComponentLoader" */ ".").then(
    (mod) => ({
      default: mod.ExampleServerComponent,
    })
  )
);

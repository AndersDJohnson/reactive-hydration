import { lazy } from "react";

export const ExampleServerComponentLoader = lazy(() =>
  import(/* webpackChunkName: "ExampleServerComponent" */ ".").then((mod) => ({
    default: mod.ExampleServerComponent,
  }))
);

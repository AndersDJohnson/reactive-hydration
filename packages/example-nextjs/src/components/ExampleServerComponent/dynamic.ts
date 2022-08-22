import dynamic from "next/dynamic";

export const ExampleServerComponentDynamic = dynamic<unknown>(() =>
  import(
    /* webpackChunkName: "ExampleServerComponentDynamic" */ "reactive-hydration-example-common"
  ).then((mod) => mod.ExampleServerComponent)
);

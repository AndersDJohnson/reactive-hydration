import dynamic from "next/dynamic";

export const ExampleServerComponentDynamic = dynamic<unknown>(() =>
  import(/* webpackChunkName: "ExampleServerComponentDynamic" */ ".").then(
    (mod) => mod.ExampleServerComponent
  )
);

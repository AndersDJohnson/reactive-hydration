import dynamic from "next/dynamic";

export const ExampleClientSetterButtonsDynamic = dynamic<unknown>(() =>
  import(
    /* webpackChunkName: "ExampleClientSetterButtonsDynamic" */ "reactive-hydration-example-common"
  ).then((mod) => mod.ExampleClientSetterButtons)
);

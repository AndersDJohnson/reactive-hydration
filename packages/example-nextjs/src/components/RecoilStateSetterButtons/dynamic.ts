import dynamic from "next/dynamic";

export const RecoilStateSetterButtonsDynamic = dynamic<unknown>(() =>
  import(
    /* webpackChunkName: "RecoilStateSetterButtonsDynamic" */ "reactive-hydration-example-common"
  ).then((mod) => mod.RecoilStateSetterButtons)
);

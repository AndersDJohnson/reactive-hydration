import dynamic from "next/dynamic";

export const RecoilStateSetterButtonsDynamic = dynamic<unknown>(() =>
  import(/* webpackChunkName: "RecoilStateSetterButtonsDynamic" */ ".").then(
    (mod) => mod.RecoilStateSetterButtons
  )
);

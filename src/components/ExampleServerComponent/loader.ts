export const ExampleServerComponentLoader = () =>
  import(/* webpackChunkName: "ExampleServerComponent" */ ".").then(
    (mod) => mod.ExampleServerComponent
  );

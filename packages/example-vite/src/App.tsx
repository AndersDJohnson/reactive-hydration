import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { RecoilStateSetterButtonsLoader } from "reactive-hydration-example-common";
import { MyReactiveHydrationContainer } from "./MyReactiveHydrationContainer";

export const App = () => {
  return (
    <RecoilRoot>
      <RecoilNexus />

      {/* TODO: Do we need `ReactiveHydrationComponentPathContextProvider` here? */}

      <h1>Home Page</h1>

      <RecoilStateSetterButtonsLoader />

      <MyReactiveHydrationContainer />
    </RecoilRoot>
  );
};

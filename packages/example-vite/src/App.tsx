import { RecoilStateSetterButtonsLoader } from "reactive-hydration-example-common";
import { MyReactiveHydrationContainer } from "./MyReactiveHydrationContainer";

const App = () => {
  return (
    <div>
      <h1>Home Page</h1>

      <RecoilStateSetterButtonsLoader />

      <MyReactiveHydrationContainer />
    </div>
  );
};

export default App;

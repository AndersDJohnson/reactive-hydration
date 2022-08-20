import { atom } from "recoil";
import { RecoilStateWithDefault } from "../ServerComponent/types";
import { registerState } from "./registry";

const defaultValue = "(initial value)";

export const textState: RecoilStateWithDefault<string> = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: defaultValue, // default value (aka initial value)
});

textState.default = defaultValue;

registerState(textState);

import { atom } from "recoil";
import { RecoilStateWithDefault } from "../ServerComponent/types";
import { registerState } from "./registry";

const defaultValue = "(initial value)";

export const text2State: RecoilStateWithDefault<string> = atom({
  key: "text2State", // unique ID (with respect to other atoms/selectors)
  default: defaultValue, // default value (aka initial value)
});

text2State.default = defaultValue;

registerState(text2State);

import { atom } from "recoil";
import { AtomWithDefault } from "../ServerComponent/types";

const defaultValue = "(initial value)";

export const text2State: AtomWithDefault<string> = atom({
  key: "text2State", // unique ID (with respect to other atoms/selectors)
  default: defaultValue, // default value (aka initial value)
});

text2State.default = defaultValue;

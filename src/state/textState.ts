import { atom } from "recoil";
import { AtomWithDefault } from "../ServerComponent/types";

const defaultValue = "(initial value)";

export const textState: AtomWithDefault<string> = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: defaultValue, // default value (aka initial value)
});

textState.default = defaultValue;

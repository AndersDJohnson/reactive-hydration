import { atom } from "recoil";

export const textStateInitialValue = "(initial value)";

export const textState = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: textStateInitialValue, // default value (aka initial value)
});

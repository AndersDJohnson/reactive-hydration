import { atom, RecoilState } from "recoil";

const defaultValue = "(initial value)";

type AtomWithDefault<T> = RecoilState<T> & { default?: any };

export const text2State: AtomWithDefault<string> = atom({
  key: "text2State", // unique ID (with respect to other atoms/selectors)
  default: defaultValue, // default value (aka initial value)
});

text2State.default = defaultValue;

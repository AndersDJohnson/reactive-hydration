import { atom, RecoilState } from "recoil";

const defaultValue = "(initial value)";

type AtomWithDefault<T> = RecoilState<T> & { default?: any };

export const textState: AtomWithDefault<string> = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: defaultValue, // default value (aka initial value)
});

textState.default = defaultValue;

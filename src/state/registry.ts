import { RecoilStateWithDefault } from "../ServerComponent/types";

const _registry: Record<string, RecoilStateWithDefault<string> | undefined> =
  {};

export const registerState = (state: RecoilStateWithDefault<any>) => {
  _registry[state.key] = state;
};

export const getRegisteredState = (key: string) => _registry[key];

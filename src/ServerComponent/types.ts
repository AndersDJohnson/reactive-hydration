import { RecoilState } from "recoil";

export type RecoilStateWithDefault<T> = RecoilState<T> & { default?: any };

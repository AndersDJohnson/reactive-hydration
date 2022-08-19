import { ComponentType } from "react";
import { RecoilState } from "recoil";

export type AtomWithDefault<T> = RecoilState<T> & { default?: any };

export type UseNested = () => {
  [id: string]: {
    states: {
      state: AtomWithDefault<any>;
      value: any;
    }[];
    loaded: boolean;
    setLoaded: () => void;
    loader: () => Promise<ComponentType<any>>;
  };
};

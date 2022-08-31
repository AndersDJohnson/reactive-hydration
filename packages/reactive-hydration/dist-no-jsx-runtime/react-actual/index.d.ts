import type { Context } from "_react";
export declare const useState: <S>(init: S | (() => S)) => [S, import("_react").Dispatch<import("_react").SetStateAction<S>>];
export declare const useContext: <T>(context: Context<T>) => T;

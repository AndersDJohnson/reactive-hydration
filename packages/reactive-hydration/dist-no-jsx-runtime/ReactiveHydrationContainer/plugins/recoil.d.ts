/// <reference types="react" />
import { RefObject } from "_react";
import { Hydrate } from "../types";
interface UsePluginRecoilArgs {
    hydrate: Hydrate;
    componentRef: RefObject<HTMLElement>;
}
export declare const usePluginRecoil: (args: UsePluginRecoilArgs) => void;
export {};

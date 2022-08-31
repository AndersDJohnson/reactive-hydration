import { Hydrate } from "../types";
interface Args {
    $component: HTMLElement;
    hydrate: Hydrate;
    contextHydratorsByContextId: Map<string, (() => void)[]>;
}
export declare const pluginContext: (args: Args) => void;
export {};

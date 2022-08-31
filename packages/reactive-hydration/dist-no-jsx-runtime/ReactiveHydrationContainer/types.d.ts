export interface Hydrator {
    (): void;
    $component?: HTMLElement;
    $context?: HTMLElement;
}
export declare type ContextHydratorsByContextElementThenComponentElement = Map<HTMLElement, Map<HTMLElement, Hydrator>>;
export declare type Hydrate = (args: {
    $component: HTMLElement;
    reason: any;
    callback?: () => void;
}) => Promise<void>;

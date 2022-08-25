export interface Hydrator {
  (): void;
  $component?: HTMLElement;
  $context?: HTMLElement;
}

export type ContextHydratorsByContextElementThenComponentElement = Map<
  HTMLElement,
  Map<HTMLElement, Hydrator>
>;

export type Hydrate = (args: {
  $component: HTMLElement;
  reason: any;
  callback?: () => void;
}) => Promise<void>;

export type ContextHydratorsByContextElementThenComponentElement = Map<
  HTMLElement,
  Map<HTMLElement, () => void>
>;

export type Hydrate = (args: {
  $component: HTMLElement;
  reason: any;
  callback?: () => void;
}) => Promise<void>;

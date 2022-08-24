export type ContextHydratorsByContextElementThenComponentElement = Map<
  HTMLElement,
  Map<HTMLElement, () => void>
>;

export type Hydrate = (args: {
  $component: HTMLElement;
  name: string;
  reason: any;
  callback?: () => void;
}) => void;

export type Hydrate = (args: {
  $component: HTMLElement;
  name: string;
  reason: any;
  callback?: () => void;
}) => void;

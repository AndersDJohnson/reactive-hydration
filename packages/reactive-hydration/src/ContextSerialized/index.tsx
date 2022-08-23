import { Context, PropsWithChildren, useMemo } from "react";

export function ContextSerialized<T>(
  props: PropsWithChildren<{
    context: Context<T>;
    name: string;
    value: T;
  }>
) {
  const { children, context, name, value } = props;

  const serializedValue = useMemo(() => JSON.stringify(value), [value]);

  return (
    <div data-context-name={name} data-context-value={serializedValue}>
      <context.Provider value={value}>{children}</context.Provider>
    </div>
  );
}

import { Context, PropsWithChildren, useMemo } from "react";

export function ContextSerialized<T>(
  props: PropsWithChildren<{
    value: T;
    context: Context<T>;
  }>
) {
  const { value, children, context } = props;

  const serializedValue = useMemo(() => JSON.stringify(value), [value]);

  return (
    <div data-context={serializedValue}>
      <context.Provider value={value}>{children}</context.Provider>
    </div>
  );
}

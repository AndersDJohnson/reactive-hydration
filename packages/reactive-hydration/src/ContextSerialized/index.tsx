import { PropsWithChildren, useId, useMemo } from "react";
import { ContextWithDefaultValues } from "../createContextWithDefaultValue";

export function ContextSerialized<T>(
  props: PropsWithChildren<{
    context: ContextWithDefaultValues<T>;
    name: string;
    value: T;
  }>
) {
  const { children, context, name, value } = props;

  const serializedValue = useMemo(() => JSON.stringify(value), [value]);

  const id = useId();

  return (
    <div
      data-context-id={id}
      data-context-name={name}
      data-context-value={serializedValue}
    >
      <context.Provider value={value}>{children}</context.Provider>
    </div>
  );
}

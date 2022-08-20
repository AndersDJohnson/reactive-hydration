import { PropsWithChildren, useId } from "react";

/**
 * On server we'll create a wrapper `div` as a portal host to mount into,
 * but on the client we don't want that wrapper or else we'll get extra nesting.
 *
 * TODO: This wrapper could perhaps be wrapped around all components by the compiler.
 */
export const ClientComponent = (
  props: PropsWithChildren<{
    id?: string;
    name: string;
    states?: string;
  }>
) => {
  const defaultId = useId();
  const id = props.id ?? defaultId;

  const inner = (
    <div data-id={id} data-component={props.name} data-states={props.states}>
      {props.children}
    </div>
  );

  return typeof window !== "object" ? (
    <div
      data-portal
      // This ID has to be here since it's the only one stable between server render and post client hydration.
      data-id={id}
    >
      {inner}
    </div>
  ) : (
    <>{inner}</>
  );
};

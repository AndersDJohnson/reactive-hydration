import { PropsWithChildren, useId } from "react-actual";
import { useContext } from "../react-actual";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";

const forceHydrate =
  typeof window === "object"
    ? window.location.search.includes("forceHydrate")
    : false;

/**
 * On server we'll create a wrapper `div` as a portal host to mount into,
 * but on the client we don't want that wrapper or else we'll get extra nesting.
 */
export const ReactiveHydrate = (
  props: PropsWithChildren<{
    id?: string;
    name: string;
    states?: string;
  }>
) => {
  const { id: idProp } = props;

  const defaultId = useId();

  const id = idProp ?? defaultId;

  const { reactiveHydratingId, parentComponentPath } = useContext(
    ReactiveHydrateContext
  );

  // TODO: Is this still needed?
  const isHydratingSelf = reactiveHydratingId === id;

  return (
    <>
      {typeof window !== "object" || !isHydratingSelf || forceHydrate ? (
        <div
          data-component={props.name}
          data-component-path={parentComponentPath.join(".")}
          data-states={props.states}
          // This ID has to be here since it's the only one stable between server render and post client hydration.
          data-id={id}
          // For soft route loading on client-side, check for `window`.
          data-loaded={typeof window === "object"}
        >
          {props.children}
        </div>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
};

ReactiveHydrate.reactiveHydrateSkip = true;

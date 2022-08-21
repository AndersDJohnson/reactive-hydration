import {
  PropsWithChildren,
  memo,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import {
  ReactiveHydrationComponentPathContext,
  ReactiveHydrationComponentPathContextProvider,
  SerializedStateContext,
} from "reactive-hydration";

/**
 * On server we'll create a wrapper `div` as a portal host to mount into,
 * but on the client we don't want that wrapper or else we'll get extra nesting.
 *
 * TODO: This wrapper could perhaps be wrapped around all components by the compiler.
 */
export const ReactiveHydrate = (
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

  return (
    <>
      {typeof window !== "object" ? (
        <div
          data-portal
          // This ID has to be here since it's the only one stable between server render and post client hydration.
          data-id={id}
        >
          {inner}
        </div>
      ) : (
        <>{inner}</>
      )}
    </>
  );
};

export const reactiveHydrate = <
  P extends {
    reactiveHydrateId?: string;
    reactiveHydratePortalState?: Record<string, any>;
  }
>(
  args: {
    name: string;
    states?: string;
  },
  Comp: React.ComponentType<P>
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const NewComp = memo<P>((props) => {
    const { name, states } = args;

    const { reactiveHydratePortalState: reactiveHydratePortalStateProp } =
      props;

    // TODO: If these IDs isn't stable enough, we could just resolve the DOM children at runtime that aren't nested inside a deeper client component.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const reactiveHydrateId = useId();

    const {
      reactiveHydratePortalState: reactiveHydratePortalStateContext,
      parentComponentPath,
      registerComponentPath,
      unregisterComponentPath,
    } = useContext(ReactiveHydrationComponentPathContext) ?? {};

    const reactiveHydratePortalState =
      reactiveHydratePortalStateProp ?? reactiveHydratePortalStateContext;

    const [componentIndex, setComponentIndex] = useState(0);

    useEffect(() => {
      setComponentIndex(registerComponentPath?.(name) ?? 0);

      return () => unregisterComponentPath?.(name);
    }, [registerComponentPath, unregisterComponentPath, name]);

    const componentPath = useMemo(
      () => [...parentComponentPath, name, componentIndex],
      [name, parentComponentPath, componentIndex]
    );

    const [reactiveHydrateState] = useState(() => {
      if (!reactiveHydratePortalState) return;

      const portalKey = componentPath.join(".");

      const state = reactiveHydratePortalState[portalKey];

      return state;
    });

    const [serializedState, setSerializedState] = useState<any[] | undefined>(
      () => []
    );

    const serializeStateContextValue = useMemo(
      () => ({
        serializedState,
        setSerializedState,
        reactiveHydrateState,
      }),
      [serializedState, setSerializedState, reactiveHydrateState]
    );

    return (
      <ReactiveHydrationComponentPathContextProvider
        reactiveHydratePortalState={reactiveHydratePortalState}
      >
        <ReactiveHydrate id={reactiveHydrateId} name={name} states={states}>
          <SerializedStateContext.Provider value={serializeStateContextValue}>
            {serializedState?.length ? (
              <div
                data-id={reactiveHydrateId}
                data-serialized-state={JSON.stringify(serializedState)}
              />
            ) : null}

            <Comp {...props} reactiveHydrateId={reactiveHydrateId} />
          </SerializedStateContext.Provider>
        </ReactiveHydrate>
      </ReactiveHydrationComponentPathContextProvider>
    );
  });

  NewComp.displayName = Comp.displayName;

  hoistNonReactStatics(NewComp, Comp);

  return NewComp;
};

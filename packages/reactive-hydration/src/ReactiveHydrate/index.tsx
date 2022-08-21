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
} from ".."

/**
 * On server we'll create a wrapper `div` as a portal host to mount into,
 * but on the client we don't want that wrapper or else we'll get extra nesting.
 */
const ReactiveHydrate = (
  props: PropsWithChildren<{
    id?: string;
    name: string;
    states?: string;
  }>
) => {
  const defaultId = useId();
  const id = props.id ?? defaultId;

  const { reactiveHydratingId } = useContext(
    ReactiveHydrationComponentPathContext
  );

  const isHydratingSelf = reactiveHydratingId === id;

  const inner = (
    <div data-id={id} data-component={props.name} data-states={props.states}>
      {props.children}
    </div>
  );

  return (
    <>
      {typeof window !== "object" || !isHydratingSelf ? (
        <div
          data-portal
          // This ID has to be here since it's the only one stable between server render and post client hydration.
          data-id={id}
          data-loaded={typeof window === "object"}
        >
          {inner}
        </div>
      ) : (
        <>{inner}</>
      )}
    </>
  );
};

/**
 * TODO: This wrapper could perhaps be wrapped around all components by the compiler.
 */
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

    const {
      reactiveHydratePortalState: reactiveHydratePortalStateProp,
      reactiveHydrateId: reactiveHydrateIdProp,
    } = props;

    // TODO: If these IDs isn't stable enough, we could just resolve the DOM children at runtime that aren't nested inside a deeper client component.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const reactiveHydrateIdNew = useId();
    const reactiveHydrateId = reactiveHydrateIdProp ?? reactiveHydrateIdNew;

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

    const [serializableState, setSerializedState] = useState<any[] | undefined>(
      () => []
    );

    const serializeStateContextValue = useMemo(
      () => ({
        serializableState,
        setSerializedState,
        reactiveHydrateState,
      }),
      [serializableState, setSerializedState, reactiveHydrateState]
    );

    const serializedState = useMemo(
      () =>
        serializableState?.length
          ? JSON.stringify(serializableState)
          : undefined,
      [serializableState]
    );

    return (
      <ReactiveHydrationComponentPathContextProvider
        reactiveHydratingId={reactiveHydrateIdProp}
        reactiveHydratePortalState={reactiveHydratePortalState}
      >
        <ReactiveHydrate id={reactiveHydrateId} name={name} states={states}>
          <SerializedStateContext.Provider value={serializeStateContextValue}>
            {serializedState ? (
              <div data-id={reactiveHydrateId} data-state={serializedState} />
            ) : null}

            <Comp {...props} />
          </SerializedStateContext.Provider>
        </ReactiveHydrate>
      </ReactiveHydrationComponentPathContextProvider>
    );
  });

  NewComp.displayName = Comp.displayName;

  hoistNonReactStatics(NewComp, Comp);

  return NewComp;
};

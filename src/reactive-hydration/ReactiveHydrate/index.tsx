import {
  createContext,
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

const ReactiveHydrateContext = createContext({
  isNested: false,
});

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

  const { isNested } = useContext(ReactiveHydrateContext);

  return (
    <ReactiveHydrateContext.Provider value={{ isNested: true }}>
      {typeof window !== "object" && !isNested ? (
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
    </ReactiveHydrateContext.Provider>
  );
};

export const reactiveHydrate = <
  P extends {
    reactiveHydrateId?: string;
    /**
     * @deprecated May not need after `reactiveHydratePortalDOM`.
     */
    reactiveHydrateInit?: any;
    reactiveHydratePortalDOM?: string;
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

    const { reactiveHydrateInit, reactiveHydratePortalDOM } = props;

    // TODO: If these IDs isn't stable enough, we could just resolve the DOM children at runtime that aren't nested inside a deeper client component.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const reactiveHydrateId = useId();

    const {
      previousComponentPath,
      registerComponentPath,
      unregisterComponentPath,
    } = useContext(ReactiveHydrationComponentPathContext) ?? {};

    const [componentIndex, setComponentIndex] = useState(0);

    useEffect(() => {
      setComponentIndex(registerComponentPath?.(name) ?? 0);

      return () => unregisterComponentPath?.(name);
    }, [registerComponentPath, unregisterComponentPath, name]);

    const componentPath = useMemo(
      () => [...previousComponentPath, name, componentIndex],
      [name, previousComponentPath, componentIndex]
    );

    console.log("*** componentPath", componentPath);

    const [serializedState, setSerializedState] = useState<
      string[] | undefined
    >(() => []);

    const serializeStateContextValue = useMemo(
      () => ({
        serializedState,
        setSerializedState,
        reactiveHydrateInit,
      }),
      [serializedState, setSerializedState, reactiveHydrateInit]
    );

    console.log("*** reactiveHydratePortalDOM", reactiveHydratePortalDOM);

    return (
      <ReactiveHydrationComponentPathContextProvider>
        <ReactiveHydrate id={reactiveHydrateId} name={name} states={states}>
          <SerializedStateContext.Provider value={serializeStateContextValue}>
            <div data-serialized-state={JSON.stringify(serializedState)} />

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

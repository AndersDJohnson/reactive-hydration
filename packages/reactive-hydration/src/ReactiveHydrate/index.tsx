import { useEffect, useId, useMemo, useRef } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import {
  HooksRef,
  ReactiveHydrateContext,
  ReactiveHydrateContextProvider,
} from "../ReactiveHydrateContext";
import { SerializedStateContext } from "../useStateSerialize";
import { WriteContextsConsumed } from "./WriteContextsConsumed";
import { ReactiveHydrate } from "./ReactiveHydrate";
import { useContext, useState } from "../react-actual";

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
    contexts?: string;
  },
  Comp: React.ComponentType<P>
) => {
  // TODO: memo wrap? if so, fix display name
  const ReactiveHydrateWrapper = (props: P) => {
    const { name, states } = args;

    const {
      reactiveHydratePortalState: reactiveHydratePortalStateProp,
      reactiveHydrateId: reactiveHydrateIdProp,
    } = props;

    // TODO: If these IDs isn't stable enough, we could just resolve the DOM children at runtime that aren't nested inside a deeper client component.
    const reactiveHydrateIdNew = useId();
    const reactiveHydrateId = reactiveHydrateIdProp ?? reactiveHydrateIdNew;

    const {
      reactiveHydratePortalState: reactiveHydratePortalStateContext,
      parentComponentPath,
      registerComponentPath,
      unregisterComponentPath,
    } = useContext(ReactiveHydrateContext) ?? {};

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

    const portalRef = useRef<HTMLDivElement>(null);
    const usedHooksRef = useRef<HooksRef>({
      contexts: new Set(),
    });

    return (
      <ReactiveHydrateContextProvider
        reactiveHydratingId={reactiveHydrateIdProp}
        reactiveHydratePortalState={reactiveHydratePortalState}
        portalRef={portalRef}
        usedHooksRef={usedHooksRef}
      >
        <ReactiveHydrate
          id={reactiveHydrateId}
          name={name}
          states={states}
          portalRef={portalRef}
        >
          <SerializedStateContext.Provider value={serializeStateContextValue}>
            {serializedState ? (
              <div data-id={reactiveHydrateId} data-state={serializedState} />
            ) : null}

            <Comp {...props} />
          </SerializedStateContext.Provider>

          <WriteContextsConsumed />
        </ReactiveHydrate>
      </ReactiveHydrateContextProvider>
    );
  };

  if (!Comp.displayName) {
    Comp.displayName = args.name;
  }

  // TODO: Do we really want/need to hoist these?
  hoistNonReactStatics(ReactiveHydrateWrapper, Comp);

  ReactiveHydrateWrapper.displayName = `ReactiveHydrateWrapper(${Comp.displayName})`;

  return ReactiveHydrateWrapper;
};

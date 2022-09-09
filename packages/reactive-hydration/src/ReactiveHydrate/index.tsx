import { PropsWithChildren, useEffect, useId, useMemo, useRef } from "_react";
import { useState, useContext } from "../react-actual";
// import hoistNonReactStatics from "hoist-non-react-statics";
import {
  HooksRef,
  ReactiveHydrateContext,
  ReactiveHydrateContextProvider,
} from "../ReactiveHydrateContext";
import { SerializedStateContext } from "../SerializedStateContext";
import { WriteContextsConsumed } from "./WriteContextsConsumed";
import { ReactiveHydrate } from "./ReactiveHydrate";
import {
  ReactiveHydrationInnardsContext,
  reactiveHydrationInnardsContextValue,
} from "../ReactiveHydrationInnardsContext";
import { ReactiveHydrationContainerContext } from "../ReactiveHydrationContainerContext";

/**
 * TODO: This wrapper could perhaps be wrapped around all components by the compiler.
 */
export const reactiveHydrate = <
  P extends PropsWithChildren<{
    reactiveHydrateId?: string;
    reactiveHydratePortalState?: Record<string, any>;
  }>
>(
  args: {
    name: string;
    /**
     * @deprecated We'll transition to a hook monkeypatch for Recoil `useAtom` to detect and track similar to `useContextUsageTracker`.
     * TODO: We'll transition to a hook monkeypatch for Recoil `useAtom` to detect and track similar to `useContextUsageTracker`.
     */
    states?: string;
  },
  Comp: React.ComponentType<P>
) => {
  if (!Comp.displayName) {
    Comp.displayName = args.name;
  }

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

    const [serializableState, setSerializableState] = useState<
      any[] | undefined
    >(() => []);

    const serializeStateContextValue = useMemo(
      () => ({
        serializableState,
        setSerializableState,
        reactiveHydrateState,
      }),
      [serializableState, setSerializableState, reactiveHydrateState]
    );

    const serializedState = useMemo(
      () =>
        serializableState?.length
          ? JSON.stringify(serializableState)
          : undefined,
      [serializableState]
    );

    const usedHooksRef = useRef<HooksRef>({
      contexts: new Set(),
    });

    return (
      <ReactiveHydrationInnardsContext.Provider
        value={reactiveHydrationInnardsContextValue}
      >
        <ReactiveHydrateContextProvider
          reactiveHydratingId={reactiveHydrateIdProp}
          reactiveHydratePortalState={reactiveHydratePortalState}
          usedHooksRef={usedHooksRef}
        >
          <ReactiveHydrate id={reactiveHydrateId} name={name} states={states}>
            <SerializedStateContext.Provider value={serializeStateContextValue}>
              {serializedState ? (
                <div data-id={reactiveHydrateId} data-state={serializedState} />
              ) : null}

              <ReactiveHydrationInnardsContext.Provider value={undefined}>
                <Comp {...props} reactiveHydrateSkip />
              </ReactiveHydrationInnardsContext.Provider>
            </SerializedStateContext.Provider>

            <WriteContextsConsumed />
          </ReactiveHydrate>
        </ReactiveHydrateContextProvider>
      </ReactiveHydrationInnardsContext.Provider>
    );
  };

  // TODO: Do we really want/need to hoist these?
  // hoistNonReactStatics(ReactiveHydrateWrapper, Comp);

  ReactiveHydrateWrapper.displayName = `ReactiveHydrateWrapper(${Comp.displayName})`;

  ReactiveHydrateWrapper.reactiveHydrateSkip = true;

  const ReactiveHydrateShortCircuitWrapper = (props: P) => {
    const reactiveHydrationContainerContext = useContext(
      ReactiveHydrationContainerContext
    );

    const { isWithinReactiveHydrationContainer } =
      reactiveHydrationContainerContext ?? {};

    if (!isWithinReactiveHydrationContainer) {
      return <Comp {...props} reactiveHydrateSkip />;
    }

    return <ReactiveHydrateWrapper {...props} />;
  };

  ReactiveHydrateShortCircuitWrapper.displayName = `ReactiveHydrateShortCircuitWrapper(${Comp.displayName})`;

  ReactiveHydrateShortCircuitWrapper.reactiveHydrateSkip = true;

  return ReactiveHydrateShortCircuitWrapper;
};

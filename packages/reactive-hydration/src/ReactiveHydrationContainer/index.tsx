import { ComponentType, memo } from "_react";
import { ReactiveHydrationContainerContext } from "../ReactiveHydrationContainerContext";
import {
  ReactiveHydrationInnardsContext,
  reactiveHydrationInnardsContextValue,
} from "../ReactiveHydrationInnardsContext";
import {
  ReactiveHydrationContainerInner,
  ReactiveHydrationContainerInnerProps,
} from "./ReactiveHydrationContainerInner";

let initialUrl = typeof window === "object" ? window.location.href : undefined;
let hasSoftRouted = false;

export interface ReactiveHydrationContainerProps
  extends ReactiveHydrationContainerInnerProps {
  /**
   * Only for server-side render.
   *
   * In Next.js, it may work best to pass a `next/dynamic` wrapper component here.
   *
   * In some frameworks, it's enough to pass something like:
   *   `typeof window === 'undefined' ? Comp : undefined`
   * to tree-shake a reference to the real component out of client bundles.
   */
  Comp?: ComponentType<unknown>;

  /**
   * This should be a lazy loaded component that will be fetched on client-side after soft routing.
   *
   * In Next.js, it may work best to pass a `next/dynamic` wrapper component here.
   *
   * In some frameworks, a `React.lazy` wrapped component may work.
   */
  LazyComp: ComponentType<unknown>;
}

const reactiveHydrationContainerContextHasNotSoftRouted = {
  isWithinReactiveHydrationContainer: true,
  hasSoftRouted: false,
};
const reactiveHydrationContainerContextHasSoftRouted = {
  isWithinReactiveHydrationContainer: true,
  hasSoftRouted: true,
};

export const ReactiveHydrationContainer = memo(
  (props: ReactiveHydrationContainerProps) => {
    const { Comp, LazyComp, importComponent, importContext } = props;

    // TODO: Subscribe to location changes.
    const isClientSideSoftRouteAwayFromInitialUrl =
      // TODO: Will this have ill effect on any rerenders during page transitions?
      typeof window === "object" && window.location.href !== initialUrl;

    if (isClientSideSoftRouteAwayFromInitialUrl) {
      hasSoftRouted = true;
    }

    const reactiveHydrationContainerContext = hasSoftRouted
      ? // TODO: Maybe we want it inactive in future, but for now I like how it keeps serializing resumable state.
        // reactiveHydrationContainerContextInactive
        reactiveHydrationContainerContextHasSoftRouted
      : reactiveHydrationContainerContextHasNotSoftRouted;

    console.log(
      "*** ReactiveHydrationContainer reactiveHydrationContainerContext",
      reactiveHydrationContainerContext
    );

    // Client-side render after soft routing - just stand up the whole tree at this point since we don't have SSR HTML to hydrate.
    if (hasSoftRouted) {
      return (
        // TODO: Do we want this active after soft route?
        <ReactiveHydrationInnardsContext.Provider
          value={reactiveHydrationInnardsContextValue}
        >
          <ReactiveHydrationContainerContext.Provider
            value={reactiveHydrationContainerContext}
          >
            {/* This `div` wrapper matches the suppress hydration `div` below to
          avoid hydration mismatch. */}
            <div>
              <ReactiveHydrationInnardsContext.Provider value={undefined}>
                {/* @ts-expect-error Forcibly passing `isReactiveHydrationServerComponent` for internal use. */}
                <LazyComp isReactiveHydrationServerComponent />
              </ReactiveHydrationInnardsContext.Provider>
            </div>
          </ReactiveHydrationContainerContext.Provider>
        </ReactiveHydrationInnardsContext.Provider>
      );
    }

    // Server-side render.
    if (typeof window !== "object" && Comp) {
      console.log("*** ReactiveHydrationContainer SSR", {
        reactiveHydrationContainerContext,
      });

      return (
        <ReactiveHydrationInnardsContext.Provider
          value={reactiveHydrationInnardsContextValue}
        >
          <ReactiveHydrationContainerContext.Provider
            value={reactiveHydrationContainerContext}
          >
            {/* This `div` wrapper matches the suppress hydration `div` below to
          avoid hydration mismatch. */}
            <div>
              <ReactiveHydrationInnardsContext.Provider value={undefined}>
                {/* @ts-expect-error Forcibly passing `isReactiveHydrationServerComponent` for internal use. */}
                <Comp isReactiveHydrationServerComponent />
              </ReactiveHydrationInnardsContext.Provider>
            </div>
          </ReactiveHydrationContainerContext.Provider>
        </ReactiveHydrationInnardsContext.Provider>
      );
    }

    return (
      <ReactiveHydrationInnardsContext.Provider
        value={reactiveHydrationInnardsContextValue}
      >
        <ReactiveHydrationContainerContext.Provider
          value={reactiveHydrationContainerContext}
        >
          <ReactiveHydrationContainerInner
            importComponent={importComponent}
            importContext={importContext}
          />
        </ReactiveHydrationContainerContext.Provider>
      </ReactiveHydrationInnardsContext.Provider>
    );
  },
  // Never re-render only due to parent re-renders.
  () => true
);

ReactiveHydrationContainer.displayName = "ReactiveHydrationContainer";

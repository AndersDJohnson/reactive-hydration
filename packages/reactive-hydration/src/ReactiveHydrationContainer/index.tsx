import { ComponentType, memo } from "react";
import { ReactiveHydrationContainerContext } from "../ReactiveHydrationContainerContext";
import {
  ReactiveHydrationContainerInner,
  ReactiveHydrationContainerInnerProps,
} from "./ReactiveHydrationContainerInner";

let initialUrl = typeof window === "object" ? window.location.href : undefined;
let isSoftRouting = false;

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

const reactiveHydrationContainerContext = {
  isActive: true,
};

export const ReactiveHydrationContainer = memo(
  (props: ReactiveHydrationContainerProps) => {
    const { Comp, LazyComp, importComponent, importContext } = props;

    const isClientSideSoftRouteAwayFromInitialUrl =
      typeof window === "object" &&
      (window.location.href !== initialUrl || isSoftRouting);

    if (isClientSideSoftRouteAwayFromInitialUrl) {
      return (
        // TODO: Do we want this active after soft route?
        <ReactiveHydrationContainerContext.Provider
          value={reactiveHydrationContainerContext}
        >
          {/* This `div` wrapper matches the suppress hydration `div` below to
          avoid hydration mismatch. */}
          <div>
            <LazyComp />
          </div>
        </ReactiveHydrationContainerContext.Provider>
      );
    }

    if (typeof window !== "object" && Comp) {
      return (
        <ReactiveHydrationContainerContext.Provider
          value={reactiveHydrationContainerContext}
        >
          {/* This `div` wrapper matches the suppress hydration `div` below to
          avoid hydration mismatch. */}
          <div>
            <Comp />
          </div>
        </ReactiveHydrationContainerContext.Provider>
      );
    }

    return (
      <ReactiveHydrationContainerContext.Provider
        value={reactiveHydrationContainerContext}
      >
        <ReactiveHydrationContainerInner
          importComponent={importComponent}
          importContext={importContext}
        />
      </ReactiveHydrationContainerContext.Provider>
    );
  },
  // Never re-render only due to parent re-renders.
  () => true
);

ReactiveHydrationContainer.displayName = "ReactiveHydrationContainer";

import { ComponentType, memo } from "react";
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

export const ReactiveHydrationContainer = memo(
  (props: ReactiveHydrationContainerProps) => {
    const { Comp, LazyComp, importComponent, importContext } = props;

    const isClientSideSoftRouteAwayFromInitialUrl =
      typeof window === "object" &&
      (window.location.href !== initialUrl || isSoftRouting);

    if (isClientSideSoftRouteAwayFromInitialUrl) {
      return (
        <div>
          <LazyComp />
        </div>
      );
    }

    if (typeof window !== "object" && Comp) {
      return (
        // This `div` wrapper matches the suppress hydration `div` below to avoid hydration mismatch.
        <div>
          <Comp />
        </div>
      );
    }

    return (
      <ReactiveHydrationContainerInner
        importComponent={importComponent}
        importContext={importContext}
      />
    );
  }
);

ReactiveHydrationContainer.displayName = "ReactiveHydrationContainer";

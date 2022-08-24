import { PropsWithChildren } from "react";
import { ComponentType, memo, ReactPortal } from "react";
import {
  ReactiveHydrationContainerInner,
  ReactiveHydrationContainerProps,
} from "./ReactiveHydrationContainerInner";

let initialUrl = typeof window === "object" ? window.location.href : undefined;
let isSoftRouting = false;

interface PortalContextTreeEntry {
  key: string;
  ContextWrapper?: ComponentType<PropsWithChildren<unknown>>;
  childPortalTreeEntries: PortalContextTreeEntry[];
  leafPortals: ReactPortal[];
}

export const ReactiveHydrationContainer = memo(
  (props: ReactiveHydrationContainerProps) => {
    const { Comp, LazyComp, importComponent, importContext } = props;

    const isClientSideSoftRouteAwayFromInitialUrl =
      typeof window === "object" &&
      (window.location.href !== initialUrl || isSoftRouting);

    if (isClientSideSoftRouteAwayFromInitialUrl)
      return (
        <div>
          <LazyComp />
        </div>
      );

    return (
      <ReactiveHydrationContainerInner
        Comp={Comp}
        LazyComp={LazyComp}
        importComponent={importComponent}
        importContext={importContext}
      />
    );
  }
);

ReactiveHydrationContainer.displayName = "ReactiveHydrationContainer";

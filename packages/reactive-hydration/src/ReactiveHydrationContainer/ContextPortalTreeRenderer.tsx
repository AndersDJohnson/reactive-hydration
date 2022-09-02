import React, {
  ComponentType,
  Fragment,
  PropsWithChildren,
  ReactPortal,
} from "_react";
import { ReactiveHydrationInnardsContext } from "../ReactiveHydrationInnardsContext";

export interface ContextPortalTreeEntry {
  key: string;
  ContextWrapper?: ComponentType<PropsWithChildren<unknown>>;
  childPortalTreeEntries: ContextPortalTreeEntry[];
  leafPortals: {
    key: string;
    portal: ReactPortal;
  }[];
}

export const ContextPortalTreeRenderer = (props: {
  contextPortalTreeEntry: ContextPortalTreeEntry;
}) => {
  const { contextPortalTreeEntry } = props;

  const { ContextWrapper, childPortalTreeEntries, leafPortals } =
    contextPortalTreeEntry ?? {};

  if (leafPortals?.length) {
    const leafPortalsWithKeys = leafPortals.map((leafPortal) => (
      <Fragment key={leafPortal.key}>{leafPortal.portal}</Fragment>
    ));

    if (ContextWrapper) {
      return (
        <ContextWrapper>
          <ReactiveHydrationInnardsContext.Provider value={undefined}>
            {leafPortalsWithKeys}
          </ReactiveHydrationInnardsContext.Provider>
        </ContextWrapper>
      );
    }

    return (
      <ReactiveHydrationInnardsContext.Provider value={undefined}>
        {leafPortalsWithKeys}
      </ReactiveHydrationInnardsContext.Provider>
    );
  }

  if (!ContextWrapper) return null;

  return (
    <ContextWrapper>
      {childPortalTreeEntries.map((childPortalTreeEntry) => (
        <ContextPortalTreeRenderer
          key={childPortalTreeEntry.key}
          contextPortalTreeEntry={childPortalTreeEntry}
        />
      ))}
    </ContextWrapper>
  );
};

ContextPortalTreeRenderer.displayName = "ContextPortalTreeRenderer";

ContextPortalTreeRenderer.reactiveHydrateSkip = true;

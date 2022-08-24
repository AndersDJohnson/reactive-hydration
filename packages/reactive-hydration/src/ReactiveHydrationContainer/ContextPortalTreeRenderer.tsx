import { ComponentType, Fragment, PropsWithChildren, ReactPortal } from "react";

export interface ContextPortalTreeEntry {
  key: string;
  ContextWrapper?: ComponentType<PropsWithChildren<unknown>>;
  childPortalTreeEntries: ContextPortalTreeEntry[];
  leafPortals: {
    key: string;
    portal: ReactPortal;
  }[];
}

const Stable = (props: PropsWithChildren<unknown>) => <>{props.children}</>;

Stable.displayName = "Stable";

export const ContextPortalTreeRenderer = (props: {
  contextPortalTreeEntry: ContextPortalTreeEntry;
}) => {
  const { contextPortalTreeEntry } = props;

  const { ContextWrapper, childPortalTreeEntries, leafPortals } =
    contextPortalTreeEntry;

  if (leafPortals?.length) {
    const leafPortalsWithKeys = leafPortals.map((leafPortal) => (
      <Stable key={leafPortal.key}>{leafPortal.portal}</Stable>
    ));

    if (ContextWrapper) {
      return <ContextWrapper>{leafPortalsWithKeys}</ContextWrapper>;
    }

    return <>{leafPortalsWithKeys}</>;
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

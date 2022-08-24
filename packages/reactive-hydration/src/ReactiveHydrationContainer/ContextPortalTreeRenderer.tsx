import { ComponentType, PropsWithChildren, ReactPortal } from "react";

export interface ContextPortalTreeEntry {
  key: string;
  ContextWrapper?: ComponentType<PropsWithChildren<unknown>>;
  childPortalTreeEntries: ContextPortalTreeEntry[];
  leafPortals: ReactPortal[];
}

export const ContextPortalTreeRenderer = (props: {
  contextPortalTreeEntry: ContextPortalTreeEntry;
}) => {
  const { contextPortalTreeEntry } = props;

  const { ContextWrapper, childPortalTreeEntries, leafPortals } =
    contextPortalTreeEntry;

  if (leafPortals?.length) {
    if (ContextWrapper) {
      return <ContextWrapper>{leafPortals}</ContextWrapper>;
    }

    return <>{leafPortals}</>;
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

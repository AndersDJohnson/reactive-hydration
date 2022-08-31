/// <reference types="react" />
import { ComponentType, PropsWithChildren, ReactPortal } from "_react";
export interface ContextPortalTreeEntry {
    key: string;
    ContextWrapper?: ComponentType<PropsWithChildren<unknown>>;
    childPortalTreeEntries: ContextPortalTreeEntry[];
    leafPortals: {
        key: string;
        portal: ReactPortal;
    }[];
}
export declare const ContextPortalTreeRenderer: {
    (props: {
        contextPortalTreeEntry: ContextPortalTreeEntry;
    }): JSX.Element | null;
    displayName: string;
};

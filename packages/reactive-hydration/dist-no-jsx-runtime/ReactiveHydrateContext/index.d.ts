/// <reference types="react" />
import React, { RefObject, PropsWithChildren } from "_react";
export interface HooksRef {
    contexts: Set<string>;
}
export declare const ReactiveHydrateContext: React.Context<{
    reactiveHydratingId?: string | undefined;
    reactiveHydratePortalState?: Record<string, any> | undefined;
    parentComponentPath: (string | number)[];
    registerComponentPath?: ((name: string) => number) | undefined;
    unregisterComponentPath?: ((name: string) => void) | undefined;
    usedHooksRef?: React.RefObject<HooksRef> | undefined;
}>;
export declare const ReactiveHydrateContextProvider: (props: React.PropsWithChildren<{
    reactiveHydratingId?: string | undefined;
    reactiveHydratePortalState?: Record<string, any> | undefined;
    usedHooksRef?: React.RefObject<HooksRef> | undefined;
}>) => JSX.Element;

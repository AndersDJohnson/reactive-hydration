import React from "_react";
/**
 * TODO: This wrapper could perhaps be wrapped around all components by the compiler.
 */
export declare const reactiveHydrate: <P extends {
    reactiveHydrateId?: string | undefined;
    reactiveHydratePortalState?: Record<string, any> | undefined;
}>(args: {
    name: string;
    /**
     * @deprecated We'll transition to a hook monkeypatch for Recoil `useAtom` to detect and track similar to `useContextUsageTracker`.
     * TODO: We'll transition to a hook monkeypatch for Recoil `useAtom` to detect and track similar to `useContextUsageTracker`.
     */
    states?: string;
}, Comp: React.ComponentType<P>) => {
    (props: P): JSX.Element;
    displayName: string;
    reactiveHydrateSkip: boolean;
};

/// <reference types="react" />
import React, { ComponentType } from "_react";
import { ReactiveHydrationContainerInnerProps } from "./ReactiveHydrationContainerInner";
export interface ReactiveHydrationContainerProps extends ReactiveHydrationContainerInnerProps {
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
export declare const ReactiveHydrationContainer: React.MemoExoticComponent<(props: ReactiveHydrationContainerProps) => JSX.Element>;

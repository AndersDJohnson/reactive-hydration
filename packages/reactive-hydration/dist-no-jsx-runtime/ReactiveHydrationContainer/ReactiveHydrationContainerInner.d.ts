/// <reference types="react" />
import React, { ComponentType } from "_react";
import { ContextWithDefaultValues } from "../createContextWithDefaultValue";
export interface ReactiveHydrationContainerInnerProps {
    /**
     * A function to import components.
     * You'll likely pass a dynamic import function here, like:
     *
     * ```ts
     * (component: string) => import(`../../components/${component}`).then((mod) => mod[component])
     * ```
     */
    importComponent: (component: string) => Promise<ComponentType<unknown>>;
    /**
     * A function to import contexts.
     * You'll likely pass a dynamic import function here, like:
     *
     * ```ts
     * (context: string) => import(`../../contexts/${context}`).then((mod) => mod[context])
     * ```
     */
    importContext: (context: string) => Promise<ContextWithDefaultValues<unknown>>;
}
export declare const ReactiveHydrationContainerInner: React.MemoExoticComponent<(props: ReactiveHydrationContainerInnerProps) => JSX.Element>;

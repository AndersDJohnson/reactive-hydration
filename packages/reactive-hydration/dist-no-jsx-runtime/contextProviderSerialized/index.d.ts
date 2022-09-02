/// <reference types="react" />
import React, { Context, PropsWithChildren } from "_react";
export declare function contextProviderSerialized<T>(context: Context<T>): {
    (props: React.PropsWithChildren<{
        value: T;
        id: string;
    }>): JSX.Element;
    displayName: string;
    reactiveHydrateSkip: boolean;
};

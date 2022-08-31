import React, { PropsWithChildren } from "_react";
/**
 * On server we'll create a wrapper `div` as a portal host to mount into,
 * but on the client we don't want that wrapper or else we'll get extra nesting.
 */
export declare const ReactiveHydrate: (props: React.PropsWithChildren<{
    id?: string | undefined;
    name: string;
    states?: string | undefined;
}>) => JSX.Element;

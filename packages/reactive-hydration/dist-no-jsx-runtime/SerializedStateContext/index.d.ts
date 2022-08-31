/// <reference types="react" />
import React from "_react";
export declare const SerializedStateContext: React.Context<{
    serializableState: string[] | undefined;
    setSerializableState: (() => string[]) | ((sf: (s: any[] | undefined) => any[] | undefined) => void);
    reactiveHydrateState?: any[] | undefined;
} | undefined>;

/// <reference types="react" />
import React, { ComponentType, PropsWithChildren } from "_react";
export declare function makeContextDefaultProviderWrapper<T>(id: string, Provider: ComponentType<PropsWithChildren<{
    value: T;
    id: string;
}>>, serializedValue: T, setContextValue: (value: T) => void): {
    (props: React.PropsWithChildren<{
        value: T;
    }>): JSX.Element;
    displayName: string;
};

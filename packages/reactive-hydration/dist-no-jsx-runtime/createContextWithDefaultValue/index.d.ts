/// <reference types="react" />
import { ComponentType, Context, PropsWithChildren } from "_react";
export declare type ContextUpdater<T> = (value: T) => void;
export declare type ContextDefaultProvider<T> = ComponentType<PropsWithChildren<{
    Provider: ComponentType<PropsWithChildren<{
        value: T;
    }>>;
    deserializedValue: T;
    defaultValue: T;
}>>;
export interface ContextDefaultValues<T> {
    displayName: string;
    defaultValue: T;
    DefaultProvider: ContextDefaultProvider<T>;
}
export declare type ContextWithDefaultValues<T> = Context<T> & ContextDefaultValues<T>;
export declare function createContextWithDefaultValue<T>(displayName: string, defaultValue: T, DefaultProvider: ContextDefaultProvider<T>): ContextWithDefaultValues<T>;

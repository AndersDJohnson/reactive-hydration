import { atom } from "recoil";
declare type AtomWithInit<T> = ReturnType<typeof atom<T>> & {
    init?: T;
};
export declare type State<T> = AtomWithInit<T> & {
    key: string;
};
export declare const registerState: <T>(key: string, state: AtomWithInit<T>, init?: T | undefined) => State<T>;
export declare const getRegisteredState: (key: string) => State<any> | undefined;
export {};

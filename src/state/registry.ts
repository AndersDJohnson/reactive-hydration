import { atom, PrimitiveAtom } from "jotai";

export type AtomWithInit<T> = ReturnType<typeof atom<T>>;

const _registry: Record<string, AtomWithInit<any> | undefined> = {};

export const registerState = <T>(key: string, state: AtomWithInit<T>) => {
  _registry[key] = state;

  return state;
};

export const getRegisteredState = (key: string) => _registry[key];

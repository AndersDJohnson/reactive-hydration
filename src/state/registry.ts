import { atom } from "recoil";

type AtomWithInit<T> = ReturnType<typeof atom<T>> & {
  init?: T;
}

export type State<T> = AtomWithInit<T> & { key: string };

const _registry = new Map<string, State<any> | undefined>();

export const registerState = <T>(key: string, state: AtomWithInit<T>, init?: T) => {
  const stateWithKey = state as State<T>;

  stateWithKey.key = key;

  stateWithKey.init = init;

  _registry.set(key, stateWithKey);

  return stateWithKey;
};

export const getRegisteredState = (key: string) => _registry.get(key);

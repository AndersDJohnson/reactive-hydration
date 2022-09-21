/*
 * Originally from: https://github.com/AndersDJohnson/react-suss/blob/master/src/util/makeResourceFromPromise.ts
 */

import { memoize } from "lodash";

type Resource<ResolveType, ArgsType extends any[]> = (
  ...args: ArgsType
) => ResolveType;

// TODO: We would ideally store this in context so it's unique to each user/request.
const getPromiseMemo = memoize(
  (getPromise: any, ...args: any[]) => getPromise(...args),
  (...args: any[]) => JSON.stringify(args)
);

export const makeResourceFromPromise = <
  ResolveType,
  ArgsType extends any[] = any[],
  ErrorType = any
>(
  getPromise: (...args: ArgsType) => Promise<ResolveType>
): Resource<ResolveType, ArgsType> => {
  let value: ResolveType;
  let error: ErrorType;
  let resolved: boolean;
  let rejected: boolean;

  return (...args: ArgsType) => {
    const promise = getPromiseMemo(getPromise, ...args);

    promise
      .then((_value: ResolveType) => {
        resolved = true;
        value = _value;
      })
      .catch((_error: ErrorType) => {
        rejected = true;
        error = _error;
      })
      .finally(() => {
        // For demo purposes, let's clear the promise each time it settles.
        // TODO: Is this working? Seems like no.
        getPromiseMemo.cache?.clear?.();
      });

    if (rejected) throw error;

    if (resolved) return value;

    throw promise;
  };
};

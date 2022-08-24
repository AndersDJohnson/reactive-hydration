import { Context } from "react";
import { useContext, useState } from "../react-actual";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";

export const useContextUsageTracker = <T>(context: Context<T>) => {
  const contextValue = useContext(context);

  const { hooksRef } = useContext(ReactiveHydrateContext);

  useState(() => {
    if (!context.displayName) {
      throw new Error("Serialized contexts must have a `displayName`.");
    }

    hooksRef?.current?.contexts.add(context.displayName);
  });

  return contextValue;
};

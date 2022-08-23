import { Context, useContext, useState } from "react";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";

export const useContextReactiveHydration = <T>(context: Context<T>) => {
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

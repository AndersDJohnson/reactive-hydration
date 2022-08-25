/* eslint-disable react-hooks/rules-of-hooks -- Okay to disable here. In any given hook call, we won't change number of hook calls between renders. */
import React from "react";
import { contextProviderSerialized } from "./ContextProviderSerialized";
import { ReactiveHydrateContext } from "./ReactiveHydrateContext";
import { useContextUsageTracker } from "./useContextUsageTracker";
import { useStateSerialize } from "./useStateSerialize";

const { useContext, useState, createContext } = React;

// @ts-expect-error We need to support the `displayName` and `bypassMonkeypatch` arguments.
React.createContext = (init, displayName, bypassMonkeypatch) => {
  const context = createContext(init);

  if (bypassMonkeypatch) {
    return context;
  }

  console.log("*** createContext pre", init, context.displayName, context);

  context.displayName = displayName;

  context.Provider = contextProviderSerialized(context);

  console.log("*** createContext post", init, context.displayName, context);

  return context;
};

// @ts-expect-error We need to support the `bypassMonkeypatch` argument.
React.useState = (init: Parameters<typeof useState>[0], bypassMonkeypatch) => {
  if (bypassMonkeypatch) {
    return useState(init);
  }

  const reactiveHydrateContext = useContext(ReactiveHydrateContext);

  if (!reactiveHydrateContext.isActive) {
    return useState(init);
  }

  return useStateSerialize(init);
};

// @ts-expect-error We need to support the `bypassMonkeypatch` argument.
React.useContext = (context: Context<unknown>, bypassMonkeypatch) => {
  if (bypassMonkeypatch) {
    return useContext(context);
  }

  const reactiveHydrateContext = useContext(ReactiveHydrateContext);

  if (!reactiveHydrateContext.isActive) {
    return useContext(context);
  }

  return useContextUsageTracker(context);
};

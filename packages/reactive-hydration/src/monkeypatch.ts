/* eslint-disable react-hooks/rules-of-hooks -- Okay to disable here. In any given hook call, we won't change number of hook calls between renders. */
import React from "react";
import { ReactiveHydrationContainerContext } from "./ReactiveHydrationContainerContext";
import { useContextUsageTracker } from "./useContextUsageTracker";
import { useStateSerialize } from "./useStateSerialize";

const { useContext, useState } = React;

// @ts-expect-error We need to support the `bypassMonkeypatch` argument.
React.useState = (init: Parameters<typeof useState>[0], bypassMonkeypatch) => {
  if (bypassMonkeypatch) {
    return useState(init);
  }

  const reactiveHydrationContainerContext = useContext(
    ReactiveHydrationContainerContext
  );

  if (!reactiveHydrationContainerContext.isActive) {
    return useState(init);
  }

  return useStateSerialize(init);
};

// @ts-expect-error We need to support the `bypassMonkeypatch` argument.
React.useContext = (context: Context<unknown>, bypassMonkeypatch) => {
  if (bypassMonkeypatch) {
    return useContext(context);
  }

  const reactiveHydrationContainerContext = useContext(
    ReactiveHydrationContainerContext
  );

  if (!reactiveHydrationContainerContext.isActive) {
    return useContext(context);
  }

  return useContextUsageTracker(context);
};

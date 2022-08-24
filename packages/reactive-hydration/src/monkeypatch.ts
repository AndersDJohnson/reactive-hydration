/* eslint-disable react-hooks/rules-of-hooks -- Okay to disable here. In any given hook call, we won't change number of hook calls between renders. */
import React from "react";
import { ReactiveHydrateContext } from "./ReactiveHydrateContext";
import { useContextReactiveHydration } from "./useContextReactiveHydration";
import { useStateSerialize } from "./useStateSerialize";

const { useContext, useState } = React;

// @ts-expect-error
React.useState = (init: Parameters<typeof useState>[0], bypassMonkeypatch) => {
  if (bypassMonkeypatch) {
    return useState(init);
  }

  const reactiveHydrateContext = useContext(
    ReactiveHydrateContext
    // // @ts-expect-error Bypass monkeypatch.
    // true
  );

  if (!reactiveHydrateContext.isActive) {
    return useState(init);
  }

  return useStateSerialize(init);
};

// @ts-expect-error
React.useContext = (context: Context<unknown>, bypassMonkeypatch) => {
  if (bypassMonkeypatch) {
    return useContext(context);
  }

  const reactiveHydrateContext = useContext(ReactiveHydrateContext);

  if (!reactiveHydrateContext.isActive) {
    return useContext(context);
  }

  return useContextReactiveHydration(context);
};

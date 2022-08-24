import React from "react";
import { ReactiveHydrateContext } from "./ReactiveHydrateContext";
import { useStateSerialize } from "./useStateSerialize";

const { useContext, useState } = React;

// @ts-expect-error
React.useState = (...args, bypassMonkeypatch) => {
  if (bypassMonkeypatch) {
    return useState(
      // @ts-expect-error
      ...args
    );
  }

  const reactiveHydrateContext = useContext(ReactiveHydrateContext);

  if (!reactiveHydrateContext.isActive) {
    return useState(
      // @ts-expect-error
      ...args
    );
  }

  return useStateSerialize(
    // @ts-expect-error
    ...args
  );
};

// @ts-expect-error
React.useStateActual = useState;

import React from "react";
import { ReactiveHydrateContext } from "./ReactiveHydrateContext";
import { useStateSerialize } from "./useStateSerialize";

const { useContext, useState } = React;

// @ts-expect-error
React.useState = (...args) => {
  const reactiveHydrateContext = useContext(ReactiveHydrateContext);

  if (!reactiveHydrateContext.isActive) {
    return useState(...args);
  }

  return useStateSerialize(...args);
};

// @ts-expect-error
React.useStateActual = useState;

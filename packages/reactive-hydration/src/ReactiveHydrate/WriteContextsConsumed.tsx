import React from "_react";
import { useContext } from "../react-actual";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";

export const WriteContextsConsumed = () => {
  const { usedHooksRef } = useContext(ReactiveHydrateContext);

  console.log("*** WriteContextsConsumed", usedHooksRef);

  const setValues = usedHooksRef?.current?.contexts.values();

  const contexts = setValues ? [...setValues] : undefined;

  if (!contexts?.length) {
    return null;
  }

  return <div data-contexts={contexts.join(",")} />;
};

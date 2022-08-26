import { useContext } from "_react";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";

export const WriteContextsConsumed = () => {
  const { usedHooksRef } = useContext(ReactiveHydrateContext);

  const setValues = usedHooksRef?.current?.contexts.values();

  const contexts = setValues ? [...setValues] : undefined;

  if (!contexts?.length) return null;

  return <div data-contexts={contexts.join(",")} />;
};

import { useContext } from "../react-actual";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";

export const WriteContextsConsumed = () => {
  const { hooksRef } = useContext(ReactiveHydrateContext);

  const setValues = hooksRef?.current?.contexts.values();

  const contexts = setValues ? [...setValues] : undefined;

  if (!contexts?.length) return null;

  return (
    <div data-contexts={contexts.join(",")}>
      contexts = {contexts.join(",")}
    </div>
  );
};

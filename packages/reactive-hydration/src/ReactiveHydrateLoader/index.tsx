import { useContext } from "../react-actual";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";

export const ReactiveHydrateLoader = () => {
  const { reactiveHydrateNestedHtml } = useContext(ReactiveHydrateContext);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: reactiveHydrateNestedHtml ?? "" }}
    />
  );
};

import { useContext } from "../react-actual";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";

interface ReactiveHydrateLoaderProps {
  name: string;
  index: number;
}

export const ReactiveHydrateLoader = (props: ReactiveHydrateLoaderProps) => {
  const {
    name,
    // TODO: Don't hard-code to zero.
    index = 0,
  } = props;

  const { reactiveHydrateNestedHtmlByComponentPath, parentComponentPath } =
    useContext(ReactiveHydrateContext);

  const componentPathKey = [...parentComponentPath, name, index].join(".");

  const reactiveHydrateNestedHtml =
    reactiveHydrateNestedHtmlByComponentPath?.[componentPathKey];

  return (
    <div
      dangerouslySetInnerHTML={{ __html: reactiveHydrateNestedHtml ?? "" }}
    />
  );
};

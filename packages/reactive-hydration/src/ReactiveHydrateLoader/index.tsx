import { useEffect, useMemo, useRef } from "react-actual";
import { useContext, useState } from "../react-actual";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";

interface ReactiveHydrateLoaderProps {
  name: string;
  index: number;
}

export const ReactiveHydrateLoader = (props: ReactiveHydrateLoaderProps) => {
  const { name } = props;

  const {
    reactiveHydrateNestedHtmlByComponentPath,
    parentComponentPath,
    registerComponentPath,
    unregisterComponentPath,
  } = useContext(ReactiveHydrateContext);

  const [componentIndex, setComponentIndex] = useState(0);

  /**
   * Disable the React 18 double effect call in dev, otherwise we bump indexes too many times.
   */
  const effectCalled = useRef(false);

  useEffect(() => {
    if (effectCalled.current) return;

    effectCalled.current = true;

    setComponentIndex(registerComponentPath?.(name) ?? 0);

    return () => unregisterComponentPath?.(name);
  }, [registerComponentPath, unregisterComponentPath, name]);

  const componentPathComputed = useMemo(
    () => [...parentComponentPath, name, componentIndex],
    [name, parentComponentPath, componentIndex]
  );

  const componentPathKey = componentPathComputed.join(".");

  const reactiveHydrateNestedHtml =
    reactiveHydrateNestedHtmlByComponentPath?.[componentPathKey];

  return (
    <div
      dangerouslySetInnerHTML={{ __html: reactiveHydrateNestedHtml ?? "" }}
    />
  );
};

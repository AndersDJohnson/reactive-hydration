import { memo, useEffect, useMemo, useRef } from "react-actual";
import { useContext, useState } from "../react-actual";
import { ReactiveHydrateContext } from "../ReactiveHydrateContext";
import { componentElementRegistry } from "../componentElementRegistry";

interface ReactiveHydrateLoaderProps {
  name: string;
  index: number;
}

export const ReactiveHydrateLoader = memo(
  (props: ReactiveHydrateLoaderProps) => {
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

    const ref = (el: HTMLDivElement | null | undefined) => {
      const existingEl = componentElementRegistry.get(componentPathKey);

      console.log(
        "*** componentElementRegistry[componentPathKey]",
        existingEl,
        componentPathKey,
        componentElementRegistry,
        // @ts-expect-error
        componentElementRegistry.id
      );

      if (!existingEl) return;

      el?.replaceWith(existingEl);
    };

    return (
      <div
        ref={ref}
        dangerouslySetInnerHTML={{ __html: reactiveHydrateNestedHtml ?? "" }}
      />
    );
  }
);

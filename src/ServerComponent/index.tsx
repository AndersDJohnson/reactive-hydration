import { memo, ReactPortal, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ServerComponentWrapper,
  useNested as useNestedServerComponentWrapper,
} from "./ServerComponentWrapper";

export const ServerComponent = memo(
  () => {
    const ref = useRef<HTMLDivElement>(null);

    const [portal, setPortal] = useState<ReactPortal | null>(null);

    const nestedServerComponentWrapper = useNestedServerComponentWrapper();

    useEffect(() => {
      for (const [componentName, componentData] of Object.entries(
        nestedServerComponentWrapper
      )) {
        const { setLoaded, loaded, loader, states } = componentData;

        // Don't re-replace after hydration.
        if (loaded) return;

        if (states.every((state) => state.value === state.state.default)) {
          return;
        }

        setLoaded();

        (async () => {
          const $wrapper = document.getElementById(componentName);

          if (!$wrapper) return;

          const Comp = await loader();

          // TODO: Remove children more performantly.
          $wrapper.innerHTML = "";

          setPortal(createPortal(<Comp />, $wrapper));
        })();
      }
    }, [nestedServerComponentWrapper]);

    if (typeof window !== "object") {
      return <ServerComponentWrapper />;
    }

    return (
      <>
        <div
          dangerouslySetInnerHTML={{
            __html: "",
          }}
          ref={ref}
          suppressHydrationWarning
        />
        {portal}
      </>
    );
  },
  () => true
);

ServerComponent.displayName = "ServerComponent";

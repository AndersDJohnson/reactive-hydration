import {
  ComponentType,
  memo,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { UseNested } from "./types";

export const ServerComponent = memo(
  ({
    Comp,
    useNested,
  }: {
    Comp: ComponentType<unknown> | undefined;
    useNested: UseNested;
  }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [portals, setPortals] = useState<ReactPortal[]>([]);

    const nested = useNested();

    useEffect(() => {
      for (const [componentName, componentData] of Object.entries(nested)) {
        const { setLoaded, loaded, loader, states } = componentData;

        // Don't re-replace after hydration.
        if (loaded) return;

        if (states.every((state) => state.value === state.state.default)) {
          return;
        }

        setLoaded();

        (async () => {
          // TODO: Find a better way to have unique IDs.
          const $wrapper = document.getElementById(componentName);

          if (!$wrapper) return;

          const Comp = await loader();

          // TODO: Remove children more performantly.
          $wrapper.innerHTML = "";

          setPortals((ps) => [...ps, createPortal(<Comp />, $wrapper)]);
        })();
      }
    }, [nested]);

    // It will be passed on the server.
    if (Comp) {
      return (
        <>
          <div>
            <Comp />
          </div>
        </>
      );
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
        {portals}
      </>
    );
  },
  () => true
);

ServerComponent.displayName = "ServerComponent";

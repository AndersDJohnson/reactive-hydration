import {
  ComponentType,
  memo,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { getRegisteredState } from "../state/registry";

export const ServerComponent = memo(
  ({ Comp }: { Comp: ComponentType<unknown> | undefined }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [portals, setPortals] = useState<ReactPortal[]>([]);

    useEffect(() => {
      if (!ref.current) return;

      const nesteds =
        ref.current.querySelectorAll<HTMLDivElement>("[data-file]");

      console.log("*** nesteds", nesteds);

      nesteds.forEach((nested) => {
        console.log("*** nested", nested);

        console.log("*** nested.dataset.file", nested.dataset.file);
        console.log("*** nested.dataset.states", nested.dataset.states);

        const stateNames = nested.dataset.states?.split(",");

        stateNames?.forEach((stateName: string) => {
          const state = getRegisteredState(stateName);

          console.log("*** state", state);
        });

        // if (states?.every((state) => state.value === state.state.default)) {
        //   return;
        // }
      });

      // for (const [componentName, componentData] of Object.entries(nested)) {
      //   const { setLoaded, loaded, loader, states } = componentData;

      //   // Don't re-replace after hydration.
      //   if (loaded) return;

      //   if (states.every((state) => state.value === state.state.default)) {
      //     return;
      //   }

      //   setLoaded();

      //   (async () => {
      //     // TODO: Find a better way to have unique IDs.
      //     const $wrapper = document.getElementById(componentName);

      //     if (!$wrapper) return;

      //     const Comp = await loader();

      //     // TODO: Remove children more performantly.
      //     $wrapper.innerHTML = "";

      //     setPortals((ps) => [...ps, createPortal(<Comp />, $wrapper)]);
      //   })();
      // }
    }, []);

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

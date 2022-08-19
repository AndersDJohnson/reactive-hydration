import { memo, ReactPortal, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilValue } from "recoil";
import { textState } from "../state/textState";
import {
  ServerComponentWrapper,
  useNested as useNestedServerComponentWrapper,
} from "./ServerComponentWrapper";

export const ServerComponent = memo(
  () => {
    const ref = useRef<HTMLDivElement>(null);

    const text = useRecoilValue(textState);

    const [portal, setPortal] = useState<ReactPortal | null>(null);

    const nestedServerComponentWrapper = useNestedServerComponentWrapper();

    useEffect(() => {
      for (const [componentName, { loader, states }] of Object.entries(
        nestedServerComponentWrapper
      )) {
        if (states.every((state) => state.value === state.state.default)) {
          return;
        }

        (async () => {
          console.log("*** must load components...");

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

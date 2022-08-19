import { memo, ReactPortal, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRecoilValue } from "recoil";
import { textState, textStateInitialValue } from "../state/textState";
import { ServerComponentWrapper } from "./ServerComponentWrapper";

export const ServerComponent = memo(
  () => {
    const ref = useRef<HTMLDivElement>(null);

    const text = useRecoilValue(textState);

    const [portal, setPortal] = useState<ReactPortal | null>(null);

    useEffect(() => {
      if (text === textStateInitialValue) return;

      (async () => {
        console.log("*** must load components...");

        const $wrapper = document.getElementById("ServerComponentInner");

        if (!$wrapper) return;

        const ServerComponentInner = await import(
          /* webpackChunkName: "ServerComponentInner" */
          "./ServerComponentInner"
        ).then((mod) => mod.ServerComponentInner);

        // TODO: Remove children more performantly.
        $wrapper.innerHTML = "";

        setPortal(createPortal(<ServerComponentInner />, $wrapper));
      })();
    }, [text]);

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

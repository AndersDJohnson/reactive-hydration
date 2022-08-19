import dynamic from "next/dynamic";
import { memo } from "react";
import { useRecoilValue } from "recoil";
import { textState, textStateInitialValue } from "../state/textState";

const ServerComponentDynamic = dynamic<unknown>(() =>
  import(
    /* webpackChunkName: "ServerComponentInner" */ "./ServerComponentInner"
  ).then((mod) => mod.ServerComponentInner)
);

export const ServerComponent = memo(
  () => {
    const text = useRecoilValue(textState);

    if (typeof window !== "object") {
      return <ServerComponentDynamic />;
    }

    if (text !== textStateInitialValue) {
      return <ServerComponentDynamic />;
    }

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: "",
        }}
        suppressHydrationWarning
      />
    );
  },
  () => true
);

ServerComponent.displayName = "ServerComponent";

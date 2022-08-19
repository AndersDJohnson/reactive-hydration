import dynamic from "next/dynamic";
import { memo } from "react";
import { useRecoilValue } from "recoil";
import { shouldLoadState } from "../state/shouldLoad";

const ServerComponentDynamic = dynamic<unknown>(() =>
  import(
    /* webpackChunkName: "ServerComponentInner" */ "./ServerComponentInner"
  ).then((mod) => mod.ServerComponentInner)
);

export const ServerComponent = memo(
  () => {
    const shouldLoad = useRecoilValue(shouldLoadState);

    if (typeof window !== "object") {
      return <ServerComponentDynamic />;
    }

    if (shouldLoad) {
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

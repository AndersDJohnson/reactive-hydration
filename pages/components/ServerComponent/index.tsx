import dynamic from "next/dynamic";
import { memo } from "react";
import { useRecoilValue } from "recoil";
import { shouldLoadState } from "../../state/shouldLoad";
import { ServerComponentInner } from "./ServerComponentInner";

const ServerComponentDynamic = dynamic<unknown>(
  /* webpackChunkName: "ServerComponentInner" */ () =>
    import("./ServerComponentInner").then((mod) => mod.ServerComponentInner)
);

export const ServerComponent = memo(
  () => {
    const shouldLoad = useRecoilValue(shouldLoadState);

    console.log("*** shouldLoad", shouldLoad);

    if (typeof window === "undefined") {
      return <ServerComponentInner />;
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

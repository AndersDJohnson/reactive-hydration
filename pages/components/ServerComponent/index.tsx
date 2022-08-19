import dynamic from "next/dynamic";
import { useRecoilValue } from "recoil";
import { shouldLoadState } from "../../state/shouldLoad";
import { ServerComponentInner } from "./ServerComponentInner";

const ServerComponentDynamic = dynamic<unknown>(() =>
  import("./ServerComponentInner").then((mod) => mod.ServerComponentInner)
);

export const ServerComponent = () => {
  const shouldLoad = useRecoilValue(shouldLoadState);

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
};

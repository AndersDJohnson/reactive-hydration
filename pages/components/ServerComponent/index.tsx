import dynamic from "next/dynamic";
import { useRecoilState } from "recoil";
import { shouldLoadState } from "../../state/shouldLoad";
import { ServerComponentInner } from "./ServerComponentInner";

const ServerComponentDynamic = dynamic<unknown>(() =>
  import("./ServerComponentInner").then((mod) => mod.ServerComponentInner)
);

export const ServerComponent = () => {
  const [shouldLoad] = useRecoilState(shouldLoadState);

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

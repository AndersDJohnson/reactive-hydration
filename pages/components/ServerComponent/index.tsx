import dynamic from "next/dynamic";
import { ServerComponentInner } from "./ServerComponentInner";

const ServerComponentDynamic = dynamic<unknown>(() =>
  import("./ServerComponentInner").then((mod) => mod.ServerComponentInner)
);

export const ServerComponent = (props: { shouldLoad: boolean }) => {
  if (typeof window === "undefined") {
    return <ServerComponentInner />;
  }

  if (props.shouldLoad) {
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

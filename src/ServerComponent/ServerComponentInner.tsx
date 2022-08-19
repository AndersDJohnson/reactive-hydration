import { memo } from "react";

export const ServerComponentInner = memo(
  () => {
    return <div>SERVER? {(typeof window === "undefined").toString()}</div>;
  },
  () => true
);

ServerComponentInner.displayName = "ServerComponentInner";

import { memo } from "react";

console.log("*** ServerComponentInner import");

export const ServerComponentInner = memo(
  () => {
    return <div>SERVER? {(typeof window === "undefined").toString()}</div>;
  },
  () => true
);

ServerComponentInner.displayName = "ServerComponentInner";

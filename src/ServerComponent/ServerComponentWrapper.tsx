import { memo } from "react";
import { ServerComponentInner } from "./ServerComponentInner";

export const ServerComponentWrapper = memo(
  () => {
    return (
      <div id="ServerComponentWrapper">
        <div>(Wrapper...)</div>
        <ServerComponentInner />
        <div>(...wrapper!)</div>
      </div>
    );
  },
  () => true
);

ServerComponentWrapper.displayName = "ServerComponentWrapper";

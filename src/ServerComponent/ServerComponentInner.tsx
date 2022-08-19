import { memo } from "react";
import { useRecoilValue } from "recoil";
import { textState } from "../state/textState";

export const ServerComponentInner = memo(
  () => {
    const text = useRecoilValue(textState);
    return (
      <div>
        <div>SERVER? {(typeof window !== "object").toString()}</div>
        <div>TEXT STATE: {text}</div>
      </div>
    );
  },
  () => true
);

ServerComponentInner.displayName = "ServerComponentInner";

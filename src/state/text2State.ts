import { atom } from "recoil";
import { registerState } from "./registry";

const init = "(initial value)";

export const text2State = registerState(
  "text2State",
  atom({
    key: "text2State",
    default: init,
  }),
  init
);

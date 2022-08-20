import { atom } from "jotai";
import { registerState } from "./registry";

export const text2State = registerState("text2State", atom("(initial value)"));

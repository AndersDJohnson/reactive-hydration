import { atom } from "jotai";
import { registerState } from "./registry";

export const textState = registerState("textState", atom("(initial value)"));

import { createContext } from "react";

export const MyContext = createContext({
  message: "default",
  setMessage: (m: string) => {},
});

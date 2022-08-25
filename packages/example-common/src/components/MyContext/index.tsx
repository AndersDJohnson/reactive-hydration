import { useMemo, useState } from "react";
import { createContextWithDefaultValue } from "reactive-hydration";

export const MyContext = createContextWithDefaultValue<{
  message: string | undefined;
  setMessage: (s: string) => void;
}>(
  "MyContext",
  {
    message: "default",
    setMessage: () => {},
  },
  (props) => {
    const { children, Provider } = props;

    const [message, setMessage] = useState<string>();

    const value = useMemo(
      () => ({
        message,
        setMessage,
      }),
      [message, setMessage]
    );

    return <Provider value={value}>{children}</Provider>;
  }
);

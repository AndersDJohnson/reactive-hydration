import { useEffect } from "react";
import { useMemo, useState } from "react";
import { createContextWithDefaultValue } from "reactive-hydration";

export const MyContext = createContextWithDefaultValue(
  "MyContext",
  {
    message: "default",
    setMessage: (_: string) => {},
  },
  (props) => {
    const { children, serializedValue, Provider, setContextValue } = props;

    const [message, setMessage] = useState<string>(serializedValue.message);

    const value = useMemo(
      () => ({
        message,
        setMessage,
      }),
      [message, setMessage]
    );

    useEffect(() => {
      setContextValue(value);
    }, [setContextValue, value]);

    return <Provider value={value}>{children}</Provider>;
  }
);

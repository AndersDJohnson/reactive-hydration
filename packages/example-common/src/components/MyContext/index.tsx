import { useEffect } from "react";
import { useMemo, useState } from "react";
import { createContextWithDefaultValue } from "reactive-hydration";

export const MyContext = createContextWithDefaultValue(
  {
    message: "default",
    setMessage: (_: string) => {},
  },
  (props) => {
    const { children, serializedValue, Context, serializedElement } = props;

    const [message, setMessage] = useState<string>(serializedValue.message);

    const value = useMemo(
      () => ({
        message,
        setMessage,
      }),
      [message, setMessage]
    );

    useEffect(() => {
      serializedElement.dataset.contextValue = JSON.stringify(value);
    }, [value]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }
);

MyContext.displayName = "MyContext";

import { useMemo, useState } from "react";
import { createContextWithDefaultValue } from "reactive-hydration";

export const MyContext = createContextWithDefaultValue(
  {
    message: "default",
    setMessage: (_: string) => {},
  },
  (props) => {
    // TODO: Read default context value from state.
    const [message, setMessage] = useState<string>(
      props.serializedValue?.message ?? props.Context.defaultValue.message
    );

    const value = useMemo(
      () => ({
        message,
        setMessage,
      }),
      [message, setMessage]
    );

    return (
      <props.Context.Provider value={value}>
        {props.children}
      </props.Context.Provider>
    );
  }
);

MyContext.displayName = "MyContext";

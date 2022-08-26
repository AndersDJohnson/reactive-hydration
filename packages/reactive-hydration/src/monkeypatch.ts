/* eslint-disable react-hooks/rules-of-hooks -- Okay to disable here. In any given hook call, we won't change number of hook calls between renders. */
import React, { ComponentType, Context, forwardRef, ReactNode } from "react";
import { bypassMonkeypatchSymbol } from "./bypassMonkeypatchSymbol";
import { reactiveHydrate } from "./ReactiveHydrate";
import { ReactiveHydrationContainerContext } from "./ReactiveHydrationContainerContext";
import { ReactiveHydrationInnardsContext } from "./ReactiveHydrationInnardsContext";
import { useContextUsageTracker } from "./useContextUsageTracker";
import { useStateSerialize } from "./useStateSerialize";

const { createElement, useContext, useState } = React;

function createElementReactiveHydration<
  P extends {
    isReactiveHydrationServerComponent: boolean;
    reactiveHydrateId?: string;
    reactiveHydratePortalState?: Record<string, any>;
  }
>(
  type:
    | string
    | (ComponentType<P> & {
        states?: string;
      }),
  props: P,
  ...children: ReactNode[]
) {
  if (children[children.length - 1] === bypassMonkeypatchSymbol) {
    return createElement(type, props, ...children.slice(0, -1));
  }

  if (typeof type === "string") {
    return createElement(type, props, ...children);
  }

  // console.log("*** createElement", type);

  // if (
  //   // TODO: Will this detect `memo` wrappers?
  //   typeof type !== "function"
  // ) {
  //   return createElement(type, props, ...children);
  // }

  const name =
    type.displayName ??
    type.name ??
    // @ts-expect-error We'll have a `render` property in case of `forwardRef` object, etc.
    type.render?.displayName ??
    // @ts-expect-error We'll have a `render` property in case of `forwardRef` object, etc.
    type.render?.name;

  if (typeof type === "function" && !name) {
    const message =
      "reactive-hydration will be disabled for components without a `displayName` property.";

    console.debug(message, type);

    console.log("*** createElement deferring to native", type);

    return createElement(type, props, ...children);
  }

  // @ts-expect-error May be a context object...
  if (type._context) {
    console.log("*** createElement deferring to native", type);

    return createElement(type, props, ...children);
  }

  // @ts-expect-error E.g. a context object won't have a `render`, but a forward ref will - any others?
  if (!type.render) {
    console.log("*** createElement deferring to native", type);

    return createElement(type, props, ...children);
  }

  console.log("*** createElement name", name);

  const Type = type;

  const { states } = Type;

  const ReactiveHydrateType = reactiveHydrate<P>(
    {
      name,
      states,
    },
    Type
  );

  const NewType = forwardRef((props: P, ref) => {
    const { isReactiveHydrationServerComponent } = props;

    const { isWithinReactiveHydrationContainer } = useContext(
      ReactiveHydrationContainerContext
    );

    const { isInReactiveHydrationInnards } =
      useContext(ReactiveHydrationInnardsContext) ?? {};

    console.log("*** NewType for", name, "booleans", {
      isReactiveHydrationServerComponent,
      isWithinReactiveHydrationContainer,
      isInReactiveHydrationInnards,
    });

    if (
      !isWithinReactiveHydrationContainer ||
      isInReactiveHydrationInnards ||
      isReactiveHydrationServerComponent
    ) {
      console.log("*** bypassing ReactiveHydrate wrapper", name);

      return createElement(Type, props, ...children);
    }

    console.log("*** using ReactiveHydrate wrapper", name);

    return createElement(ReactiveHydrateType, props, ...children);
  });

  NewType.displayName = `ReactiveHydrationCreateElementWrapper(${name})`;

  return createElement(
    NewType,
    // @ts-expect-error Types won't quite match here, but just forwarding.
    props,
    ...children
  );
}

// @ts-expect-error Hard to get types exactly right...
React.createElement = createElementReactiveHydration;

// @ts-expect-error We need to support the `bypassMonkeypatch` argument.
React.useState = (
  // @ts-expect-error Not sure why this tuple type doesn't work.
  init: Parameters<typeof useState>[0],
  bypassMonkeypatch: typeof bypassMonkeypatchSymbol
) => {
  if (bypassMonkeypatch === bypassMonkeypatchSymbol) {
    return useState(init);
  }

  const { isWithinReactiveHydrationContainer } = useContext(
    ReactiveHydrationContainerContext
  );

  if (!isWithinReactiveHydrationContainer) {
    return useState(init);
  }

  return useStateSerialize(init);
};

// @ts-expect-error We need to support the `bypassMonkeypatch` argument.
React.useContext = (
  context: Context<unknown>,
  bypassMonkeypatch: typeof bypassMonkeypatchSymbol
) => {
  if (bypassMonkeypatch === bypassMonkeypatchSymbol) {
    return useContext(context);
  }

  const { isWithinReactiveHydrationContainer } = useContext(
    ReactiveHydrationContainerContext
  );

  if (!isWithinReactiveHydrationContainer) {
    return useContext(context);
  }

  return useContextUsageTracker(context);
};

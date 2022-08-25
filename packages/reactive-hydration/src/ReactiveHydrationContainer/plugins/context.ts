import {
  ContextHydratorsByContextElementThenComponentElement,
  Hydrate,
} from "../types";

interface Args {
  $component: HTMLElement;
  hydrate: Hydrate;
  contextHydratorsByContextElementThenComponentElement: ContextHydratorsByContextElementThenComponentElement;
}

export const pluginContext = (args: Args) => {
  const {
    $component,
    hydrate,
    contextHydratorsByContextElementThenComponentElement,
  } = args;

  console.log("*** pluginContext", $component);

  const contextNames = $component
    .querySelector<HTMLElement>(
      // TODO: Check browser support for `:scope` selector.
      ":scope > [data-contexts]"
    )
    ?.dataset.contexts?.split(",");

  console.log("*** contextNames", contextNames);

  contextNames?.forEach((contextName) => {
    const $context = $component.closest<HTMLElement>(
      `[data-context-name="${contextName}"]`
    );

    if (!$context) return;

    let contextHydratorsByContextElement =
      contextHydratorsByContextElementThenComponentElement.get($context);

    if (!contextHydratorsByContextElement) {
      contextHydratorsByContextElement = new Map();

      contextHydratorsByContextElementThenComponentElement.set(
        $context,
        contextHydratorsByContextElement
      );
    }

    contextHydratorsByContextElement?.set($component, () => {
      console.log("*** context hydrator for $component", $component);
      hydrate({
        $component: $component,
        reason: ["context", contextName],
      });
    });
  });
};

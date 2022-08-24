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

  const contextNames = $component
    .querySelector<HTMLElement>(
      // TODO: Check browser support for `:scope` selector.
      ":scope > [data-contexts]"
    )
    ?.dataset.contexts?.split(",");

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
      hydrate({
        $component: $component,
        reason: ["context", contextName],
      });
    });
  });
};

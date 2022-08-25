import {
  ContextHydratorsByContextElementThenComponentElement,
  Hydrate,
} from "../types";

interface Args {
  $component: HTMLElement;
  hydrate: Hydrate;
  contextHydratorsByContextId: Map<string, (() => void)[]>;
  contextHydratorsByContextElementThenComponentElement: ContextHydratorsByContextElementThenComponentElement;
}

export const pluginContext = (args: Args) => {
  const {
    $component,
    hydrate,
    contextHydratorsByContextId,
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

    const contextValue = $context.dataset?.contextValue;

    const parsedValue = contextValue ? JSON.parse(contextValue) : undefined;

    if (parsedValue?.__id) {
      let contextHydrators = contextHydratorsByContextId.get(parsedValue.__id);

      if (!contextHydrators) {
        contextHydrators = [];

        contextHydratorsByContextId.set(parsedValue.__id, contextHydrators);
      }

      const hydrator = () => {
        hydrate({
          $component: $component,
          reason: ["context (by SSR ID)", contextName],
        });
      };

      hydrator.$component = $component;
      hydrator.$context = $context;

      contextHydrators.push(hydrator);
    }

    let contextHydratorsByContextElement =
      contextHydratorsByContextElementThenComponentElement.get($context);

    if (!contextHydratorsByContextElement) {
      contextHydratorsByContextElement = new Map();

      contextHydratorsByContextElementThenComponentElement.set(
        $context,
        contextHydratorsByContextElement
      );
    }

    const hydrator = () => {
      hydrate({
        $component: $component,
        reason: ["context (by tree)", contextName],
      });
    };

    hydrator.$component = $component;
    hydrator.$context = $context;

    contextHydratorsByContextElement?.set($component, hydrator);
  });
};

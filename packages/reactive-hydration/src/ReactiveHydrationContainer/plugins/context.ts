import { Hydrate } from "../types";

interface Args {
  $component: HTMLElement;
  hydrate: Hydrate;
  contextHydratorsByContextId: Map<string, (() => void)[]>;
}

export const pluginContext = (args: Args) => {
  const { $component, hydrate, contextHydratorsByContextId } = args;

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

    const contextId = $context.dataset?.contextId;

    if (!contextId) return;

    let contextHydrators = contextHydratorsByContextId.get(contextId);

    if (!contextHydrators) {
      contextHydrators = [];

      contextHydratorsByContextId.set(contextId, contextHydrators);
    }

    const hydrator = () => {
      hydrate({
        $component,
        reason: ["context (by SSR ID)", contextName],
      });
    };

    hydrator.$component = $component;
    hydrator.$context = $context;

    contextHydrators.push(hydrator);
  });
};

import {
  Fragment,
  PropsWithChildren,
  ReactNode,
  useCallback,
  ComponentType,
  memo,
  useEffect,
  useRef,
} from "react-actual";
import { useState } from "../react-actual";
import { createPortal } from "react-dom";
import { truthy } from "../utilities/truthy";
import { ContextWithDefaultValues } from "../createContextWithDefaultValue";
import { makeContextDefaultProviderWrapper } from "../makeContextDefaultProviderWrapper";
import { pluginClick } from "./plugins/click";
import {
  ContextPortalTreeEntry,
  ContextPortalTreeRenderer,
} from "./ContextPortalTreeRenderer";
import { usePluginRecoil } from "./plugins/recoil";
import { Hydrate, Hydrator } from "./types";
import { pluginContext } from "./plugins/context";
import { ReactiveHydrationInnardsContext } from "../ReactiveHydrationInnardsContext";

const hydratedComponentIdsMap = new Map<string, boolean>();

const ContextDefaultProviderWrapperByContextElement = new Map<
  HTMLElement,
  ReturnType<typeof makeContextDefaultProviderWrapper>
>();

export interface ReactiveHydrationContainerInnerProps {
  /**
   * A function to import components.
   * You'll likely pass a dynamic import function here, like:
   *
   * ```ts
   * (component: string) => import(`../../components/${component}`).then((mod) => mod[component])
   * ```
   */
  importComponent: (component: string) => Promise<ComponentType<unknown>>;

  /**
   * A function to import contexts.
   * You'll likely pass a dynamic import function here, like:
   *
   * ```ts
   * (context: string) => import(`../../contexts/${context}`).then((mod) => mod[context])
   * ```
   */
  importContext: (
    context: string
  ) => Promise<ContextWithDefaultValues<unknown>>;
}

export const ReactiveHydrationContainerInner = memo(
  (props: ReactiveHydrationContainerInnerProps) => {
    const { importComponent, importContext } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    const [contextPortalTree] = useState(
      () => new Map<string, ContextPortalTreeEntry>()
    );

    const [topmostContextPortalTreeEntries] = useState(
      () => new Set<ContextPortalTreeEntry>()
    );

    const [contextFreePortals] = useState<
      {
        key: string;
        portal: ReactNode;
      }[]
    >(() => []);

    const [, setForcedRender] = useState(() => ({}));
    const forceRender = useCallback(() => setForcedRender({}), []);

    const [pendingCallbacks, setPendingCallbacks] = useState<(() => void)[]>(
      () => []
    );

    const [contextHydratorsByContextId] = useState<Map<string, Hydrator[]>>(
      () => new Map()
    );

    const getSetContextValueByContextElement = useCallback(
      ($context: HTMLElement) => (value: unknown) => {
        const serializedCurrentValue = $context.dataset.contextValue;
        const contextId = $context.dataset.contextId;

        if (!contextId) return;

        const serializedNewValue = JSON.stringify(value);

        if (serializedNewValue === serializedCurrentValue) return;

        $context.dataset.contextValue = serializedNewValue;

        [...(contextHydratorsByContextId.get(contextId) ?? [])].forEach(
          (hydrator) => {
            if (hydrator.$context) {
              hydrator.$context.dataset.contextValue = serializedNewValue;
            }

            hydrator();
          }
        );
      },
      [contextHydratorsByContextId]
    );

    const hydrate = useCallback<Hydrate>(
      async (args) => {
        const { $component, reason, callback } = args;

        const id = $component.dataset?.id;
        const name = $component.dataset?.component;
        const componentPath = $component.dataset?.componentPath;
        const loaded = $component.dataset?.loaded;

        if (!id) return;
        if (!name) return;
        if (!componentPath) return;

        // Don't re-hydrate - would cause infinite loops.
        if (loaded === "true") {
          return;
        }

        if (hydratedComponentIdsMap.get(id)) return;

        hydratedComponentIdsMap.set(id, true);

        const realPropsSerialized = $component.dataset?.props;

        const realProps = realPropsSerialized
          ? JSON.parse(realPropsSerialized)
          : undefined;

        // // TODO: Do we still need this `hasHydratedAncestor` check?
        // const hasHydratedAncestor = $component.parentElement?.closest(
        //   '[data-loaded="true"]'
        // );

        // if (hasHydratedAncestor) return;

        console.debug(
          "Hydrating",
          name,
          $component,
          "due to:",
          ...(Array.isArray(reason) ? reason : [reason])
        );

        $component.dataset.loading = "true";

        const ImportedComponent = (await importComponent(
          name
        )) as ComponentType<{
          componentPath: string;
          reactiveHydrateId: string;
          reactiveHydrateNestedHtmlByComponentPath: Record<
            string,
            string | undefined
          >;
          reactiveHydratePortalState: Record<string, any>;
        }>;

        const portalState: Record<string, any> = {};

        let handledIds: string[] = [];

        let $currentComponent: HTMLElement | null = $component;
        let previousComponentIndexByName = new Map();

        while ($currentComponent) {
          const currentName = $currentComponent?.dataset.component;
          if (!currentName) continue;
          const currentId = $currentComponent?.dataset.id;
          if (!currentId) continue;

          const currentSerializedStateSelector = `[data-id="${currentId}"][data-state]`;

          const currentSerializedStateElement =
            $currentComponent?.querySelector<HTMLElement>(
              currentSerializedStateSelector
            );

          const currentSerializedState =
            currentSerializedStateElement?.dataset.state;

          const currentComponentIndex =
            (previousComponentIndexByName.get(currentName) ?? -1) + 1;

          previousComponentIndexByName.set(currentName, currentComponentIndex);

          if (currentSerializedState) {
            const currentStateKey = `${currentName}.${currentComponentIndex}`;

            portalState[currentStateKey] = JSON.parse(currentSerializedState);
          }

          handledIds.push(currentId);

          const nextComponentSelector = `[data-component][data-id]${handledIds
            .map((hid) => `:not([data-id="${hid}"])`)
            .join("")}`;

          const $nextComponent = $component.querySelector<HTMLElement>(
            nextComponentSelector
          );

          if ($currentComponent.contains($nextComponent)) {
            previousComponentIndexByName = new Map();
          }

          $currentComponent = $nextComponent;
        }

        const $newElement = document.createElement("div");

        const dataset = { ...$component.dataset };

        for (const [key, value] of Object.entries(dataset)) {
          $newElement.dataset[key] = value;
        }
        $newElement.dataset.id = id;
        $newElement.dataset.loading = "false";
        $newElement.dataset.loaded = "true";

        const $contexts = [];

        let $closestContext: HTMLElement | null | undefined;
        let $topmostContext: HTMLElement | null | undefined;

        let $context: HTMLElement | null | undefined = $component;

        let contextPortalTreePath = [];

        // eslint-disable-next-line no-constant-condition -- We are handling carefully with `break` statements.
        while (true) {
          const $previous: HTMLElement | null | undefined = $context;
          const previousId = $previous?.dataset.contextId;

          $context = $context?.closest<HTMLElement>("[data-context-value]");

          if ($context) {
            $topmostContext = $context;
          }

          if ($context === $previous) {
            $context = $context.parentElement;
          }

          if (!$context) break;

          if (!$closestContext) {
            $closestContext = $context;
          }

          const contextId = $context?.dataset.contextId;
          const contextName = $context?.dataset.contextName;

          if (!contextId) break;
          if (!contextName) break;

          contextPortalTreePath.push(`${contextName}[${contextId}]`);

          const contextPortalTreeEntryKey = contextPortalTreePath.join(" > ");

          let contextPortalTreeEntry = contextPortalTree.get(contextId);

          if (!contextPortalTreeEntry) {
            contextPortalTreeEntry = {
              key: contextPortalTreeEntryKey,
              childPortalTreeEntries: [],
              leafPortals: [],
            };

            contextPortalTree.set(contextId, contextPortalTreeEntry);
          }

          const previousContextPortalTreeEntry = previousId
            ? contextPortalTree.get(previousId)
            : undefined;

          if (previousContextPortalTreeEntry) {
            contextPortalTreeEntry.childPortalTreeEntries.push(
              previousContextPortalTreeEntry
            );
          }

          $contexts.push($context);
        }

        if ($topmostContext) {
          const topmostContextId = $topmostContext?.dataset.contextId;

          const topmostContextPortalTreeEntry = topmostContextId
            ? contextPortalTree.get(topmostContextId)
            : undefined;

          if (topmostContextPortalTreeEntry) {
            topmostContextPortalTreeEntries.add(topmostContextPortalTreeEntry);
          }
        }

        if ($contexts.length) {
          const contextMetas = (
            await Promise.all(
              $contexts.map(async ($context) => {
                const contextName = $context?.dataset.contextName;
                const serializedValue = $context?.dataset.contextValue;

                if (!contextName) return;
                if (!serializedValue) return;

                const Context = await importContext(contextName);

                const deserializedValue = JSON.parse(serializedValue);

                return {
                  $context,
                  Context,
                  deserializedValue,
                };
              })
            )
          ).filter(truthy);

          contextMetas.forEach((contextMeta) => {
            const { $context, Context, deserializedValue } = contextMeta;
            const { DefaultProvider, Provider } = Context;

            const contextId = $context?.dataset.contextId;

            if (!contextId) return;

            const contextPortalTreeEntry = contextPortalTree.get(contextId);

            let ContextDefaultProviderWrapper =
              ContextDefaultProviderWrapperByContextElement.get($context);

            if (!ContextDefaultProviderWrapper) {
              const setContextValue =
                getSetContextValueByContextElement($context);

              ContextDefaultProviderWrapper = makeContextDefaultProviderWrapper(
                contextId,
                Provider,
                deserializedValue,
                setContextValue
              );

              ContextDefaultProviderWrapperByContextElement.set(
                $context,
                ContextDefaultProviderWrapper
              );
            }

            if (!ContextDefaultProviderWrapper) return;

            const ExistingContextDefaultProviderWrapper =
              ContextDefaultProviderWrapper;

            if (
              contextPortalTreeEntry &&
              !contextPortalTreeEntry.ContextWrapper
            ) {
              const ContextWrapper = (props: PropsWithChildren<unknown>) => (
                <DefaultProvider
                  key={contextPortalTreeEntry.key}
                  Provider={ExistingContextDefaultProviderWrapper}
                  defaultValue={Context.defaultValue}
                  deserializedValue={deserializedValue}
                >
                  {props.children}
                </DefaultProvider>
              );

              ContextWrapper.displayName = "ContextWrapper";

              ContextWrapper.reactiveHydrateSkip = true;

              contextPortalTreeEntry.ContextWrapper = ContextWrapper;
            }
          });
        }

        const $components = [
          ...$component.querySelectorAll<HTMLElement>("[data-component]"),
        ];

        const reactiveHydrateNestedHtmlByComponentPath = $components.reduce(
          (acc, $c) => ({
            ...acc,
            [$c.dataset.componentPath ?? ""]: $c?.outerHTML,
          }),
          {}
        );

        const portal = createPortal(
          <ImportedComponent
            componentPath={componentPath}
            reactiveHydrateId={id}
            reactiveHydratePortalState={portalState}
            reactiveHydrateNestedHtmlByComponentPath={
              reactiveHydrateNestedHtmlByComponentPath
            }
            {...realProps}
          />,
          $newElement
        );

        const key = [...contextPortalTreePath, `${name}[${id}]`].join(" > ");

        const closestContextId = $closestContext?.dataset?.contextId;

        const closestContextPortalTreeEntry = closestContextId
          ? contextPortalTree.get(closestContextId)
          : undefined;

        if (closestContextPortalTreeEntry) {
          closestContextPortalTreeEntry.leafPortals.push({
            key,
            portal,
          });
        } else {
          contextFreePortals.push({
            key,
            portal,
          });
        }

        forceRender();

        // TODO: Move into separate effect so it's guaranteed to run only after portals are rendered into component tree?
        // This would avoid any flickering of empty DOM.
        // And ensure click callbacks fire after new portal is inserted into DOM.
        setTimeout(() => {
          $component.replaceWith($newElement);

          if (callback) {
            setPendingCallbacks((p) => [...p, callback]);
          }
        });
      },
      [
        contextFreePortals,
        contextPortalTree,
        forceRender,
        getSetContextValueByContextElement,
        importComponent,
        importContext,
        topmostContextPortalTreeEntries,
      ]
    );

    useEffect(() => {
      if (!pendingCallbacks.length) return;

      const callbacks = pendingCallbacks;

      setPendingCallbacks([]);

      // TODO: This may be a bit of a race condition and cause clicks to not register?
      setTimeout(() => {
        callbacks.forEach((callback) => callback());
      });
    }, [pendingCallbacks]);

    useEffect(() => {
      // TODO: Effects should not short circuit on refs - refactor to ref callback.
      if (!containerRef.current) return;

      pluginClick({
        $container: containerRef.current,
        hydrate,
      });
    }, [hydrate]);

    useEffect(() => {
      // TODO: Effects should not short circuit on refs - refactor to ref callback.

      if (!containerRef.current) return;

      const $components =
        containerRef.current?.querySelectorAll<HTMLElement>("[data-component]");

      if (!$components) return;

      $components.forEach(($component) => {
        const init = $component.dataset?.init;
        if (init === "true") return;
        $component.dataset.init = "true";

        const id = $component.dataset.id;
        const component = $component.dataset.component;

        if (!id) return;
        if (!component) return;

        pluginContext({
          $component,
          hydrate,
          contextHydratorsByContextId,
        });
      });
    }, [hydrate, contextHydratorsByContextId]);

    usePluginRecoil({
      hydrate,
      containerRef,
    });

    return (
      <>
        {/* Suppress hydration since we won't be loading the component on client. */}
        <div
          dangerouslySetInnerHTML={{
            __html: "",
          }}
          ref={containerRef}
          suppressHydrationWarning
        />

        {/* Render the portals, which won't themselves have any DOM output, so on initial load we'll still match SSR HTML. */}

        {[...(topmostContextPortalTreeEntries?.values() ?? [])].map(
          (topmostContextPortalTreeEntry) => (
            <ContextPortalTreeRenderer
              key={topmostContextPortalTreeEntry.key}
              contextPortalTreeEntry={topmostContextPortalTreeEntry}
            />
          )
        )}

        {contextFreePortals.map((portal) => (
          <ReactiveHydrationInnardsContext.Provider
            value={undefined}
            key={portal.key}
          >
            <Fragment>{portal.portal}</Fragment>
          </ReactiveHydrationInnardsContext.Provider>
        ))}
      </>
    );
  },
  // Never re-render only due to parent re-renders.
  () => true
);

ReactiveHydrationContainerInner.displayName = "ReactiveHydrationContainerInner";

// @ts-expect-error
ReactiveHydrationContainerInner.reactiveHydrateSkip = true;

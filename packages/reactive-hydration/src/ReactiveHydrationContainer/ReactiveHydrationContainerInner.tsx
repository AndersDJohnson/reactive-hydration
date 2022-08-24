import { PropsWithChildren, ReactNode, useCallback } from "react";
import { ComponentType, memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { truthy } from "../utilities/truthy";
import { ContextWithDefaultValues } from "../useContextReactiveHydration";
import { pluginClick } from "./plugins/click";
import {
  ContextPortalTreeEntry,
  ContextPortalTreeRenderer,
} from "./ContextPortalTreeRenderer";
import { usePluginRecoil } from "./plugins/recoil";
import {
  ContextHydratorsByContextElementThenComponentElement,
  Hydrate,
} from "./types";
import { pluginContext } from "./plugins/context";

const hydratedComponentsMap = new WeakMap();

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

    const componentRef = useRef<HTMLDivElement>(null);

    const [contextPortalTree] = useState(
      () => new Map<HTMLElement, ContextPortalTreeEntry>()
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

    const [forcedRender, setForcedRender] = useState({});
    const forceRender = useCallback(() => setForcedRender({}), []);

    const [pendingCallbacks, setPendingCallbacks] = useState<(() => void)[]>(
      []
    );

    const [contextHydratorsByContextElementThenComponentElement] =
      useState<ContextHydratorsByContextElementThenComponentElement>(new Map());

    const getSetContextValueByContextElement = useCallback(
      ($context: HTMLElement) => (value: unknown) => {
        const currentValue = $context.dataset.contextValue;

        const newValue = JSON.stringify(value);

        if (newValue === currentValue) return;

        $context.dataset.contextValue = newValue;

        [
          ...(contextHydratorsByContextElementThenComponentElement
            .get($context)
            ?.values() ?? []),
        ].forEach((hydrator) => hydrator());
      },
      []
    );

    const hydrate = useCallback<Hydrate>(async (args) => {
      const { $component, reason, callback } = args;

      const id = $component.dataset?.id;
      const name = $component.dataset?.component;

      if (!id) return;
      if (!name) return;

      if (hydratedComponentsMap.has($component)) return;

      console.debug(
        "Hydrating",
        $component,
        "due to:",
        ...(Array.isArray(reason) ? reason : [reason])
      );

      hydratedComponentsMap.set($component, true);

      $component.dataset.loading = "true";

      const ImportedComponent: ComponentType<{
        reactiveHydrateId?: string;
        reactiveHydratePortalState?: Record<string, any>;
      }> = await importComponent(name);

      const reactiveHydrateId = $component.dataset.id;

      const portalState: Record<string, any> = {};

      let handledIds: string[] = [];

      let $currentComponent: HTMLElement | null = $component;
      let previousComponentIndexByName = new Map();

      while ($currentComponent) {
        const currentComponent = $currentComponent?.dataset.component;
        if (!currentComponent) continue;
        const currentId = $currentComponent?.dataset.id;
        if (!currentId) continue;

        const currentSerializedState =
          $currentComponent?.querySelector<HTMLElement>(
            `[data-id="${currentId}"][data-state]`
          )?.dataset.state;

        const currentComponentIndex =
          (previousComponentIndexByName.get(currentComponent) ?? -1) + 1;

        previousComponentIndexByName.set(
          currentComponent,
          currentComponentIndex
        );

        if (currentSerializedState) {
          const currentStateKey = `${currentComponent}.${currentComponentIndex}`;

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
      $newElement.dataset.id = reactiveHydrateId;
      $newElement.dataset.loading = "false";
      $newElement.dataset.loaded = "true";

      if (callback) {
        setPendingCallbacks((p) => [...p, callback]);
      }

      const $contexts = [];

      let $closestContext: HTMLElement | null | undefined;
      let $topmostContext: HTMLElement | null | undefined;

      let $context: HTMLElement | null | undefined = $component;

      let contextPortalTreePath = [];

      while (true) {
        const $previous: HTMLElement | null | undefined = $context;

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

        let contextPortalTreeEntry = contextPortalTree.get($context);

        if (!contextPortalTreeEntry) {
          contextPortalTreeEntry = {
            key: contextPortalTreeEntryKey,
            childPortalTreeEntries: [],
            leafPortals: [],
          };

          contextPortalTree.set($context, contextPortalTreeEntry);
        }

        const previousContextPortalTreeEntry = contextPortalTree.get($previous);

        if (previousContextPortalTreeEntry) {
          contextPortalTreeEntry.childPortalTreeEntries.push(
            previousContextPortalTreeEntry
          );
        }

        $contexts.push($context);
      }

      if ($topmostContext) {
        const topmostContextPortalTreeEntry =
          contextPortalTree.get($topmostContext);

        if (topmostContextPortalTreeEntry) {
          topmostContextPortalTreeEntries.add(topmostContextPortalTreeEntry);
        }
      }

      if ($contexts.length) {
        const contexts = (
          await Promise.all(
            $contexts.map(async ($context) => {
              const contextName = $context?.dataset.contextName;
              const serializedValue = $context?.dataset.contextValue;

              if (!contextName) return;
              if (!serializedValue) return;

              const context = await importContext(contextName);

              const value = JSON.parse(serializedValue);

              return {
                $context,
                context,
                value,
              };
            })
          )
        ).filter(truthy);

        contexts.forEach((context) => {
          const contextPortalTreeEntry = contextPortalTree.get(
            context.$context
          );

          const setContextValue = getSetContextValueByContextElement(
            context.$context
          );

          if (
            contextPortalTreeEntry &&
            !contextPortalTreeEntry.ContextWrapper
          ) {
            const ContextWrapper = (props: PropsWithChildren<unknown>) => (
              <context.context.DefaultProvider
                key={contextPortalTreeEntry.key}
                Context={context.context}
                serializedValue={context.value}
                setContextValue={setContextValue}
              >
                {props.children}
              </context.context.DefaultProvider>
            );

            ContextWrapper.displayName = "ContextWrapper";

            contextPortalTreeEntry.ContextWrapper = ContextWrapper;
          }
        });
      }

      const portal = createPortal(
        <ImportedComponent
          reactiveHydrateId={reactiveHydrateId}
          reactiveHydratePortalState={portalState}
        />,
        $newElement
      );

      const key = [...contextPortalTreePath, `${name}[${id}]`].join(" > ");

      const closestContextPortalTreeEntry = $closestContext
        ? contextPortalTree.get($closestContext)
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
      });
    }, []);

    useEffect(() => {
      if (!pendingCallbacks.length) return;

      const callbacks = pendingCallbacks;

      setPendingCallbacks([]);

      // TODO: This may be a bit of a race condition and cause clicks to not register?
      setTimeout(() => {
        callbacks.forEach((callback) => callback());
      });
    }, [forcedRender, pendingCallbacks]);

    useEffect(() => {
      const $components =
        componentRef.current?.querySelectorAll<HTMLElement>("[data-component]");

      if (!$components) return;

      $components.forEach(($component) => {
        const init = $component.dataset?.init;
        if (init === "true") return;
        $component.dataset.init = "true";

        const id = $component.dataset.id;
        const component = $component.dataset.component;

        if (!id) return;
        if (!component) return;

        pluginClick({
          $component,
          id,
          hydrate,
        });

        pluginContext({
          $component,
          hydrate,
          contextHydratorsByContextElementThenComponentElement,
        });
      });
    }, [hydrate]);

    usePluginRecoil({
      hydrate,
      componentRef,
    });

    return (
      <>
        {/* Suppress hydration since we won't be loading the component on client. */}
        <div
          dangerouslySetInnerHTML={{
            __html: "",
          }}
          ref={componentRef}
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

        {contextFreePortals}
      </>
    );
  },
  // Never re-render only due to parent re-renders.
  () => true
);

ReactiveHydrationContainerInner.displayName = "ReactiveHydrationContainerInner";

import { Context, useCallback, useMemo } from "react";
import { selector, useRecoilValue } from "recoil";
import { getRecoil } from "recoil-nexus";
import {
  ComponentType,
  memo,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import domElementPath from "dom-element-path";
import { getRegisteredState, State } from "../stateRegistry";
import { truthy } from "../utilities/truthy";
import { ContextWithDefaultValues } from "../useContextReactiveHydration";

const loadedNestedsMap = new WeakMap();

const clicksMap = new WeakMap();

let initialUrl = typeof window === "object" ? window.location.href : undefined;
let isSoftRouting = false;

export const ReactiveHydrationContainer = memo(
  ({
    Comp,
    LazyComp,
    importComponent,
    importContext,
  }: {
    /**
     * Only for server-side render.
     *
     * In Next.js, it may work best to pass a `next/dynamic` wrapper component here.
     *
     * In some frameworks, it's enough to pass something like:
     *   `typeof window === 'undefined' ? Comp : undefined`
     * to tree-shake a reference to the real component out of client bundles.
     */
    Comp?: ComponentType<unknown>;
    /**
     * Only passed on server-side render.
     *
     * In Next.js, it may work best to pass a `next/dynamic` wrapper component here.
     *
     * In some frameworks, a `React.lazy` wrapped component may work.
     */
    LazyComp: ComponentType<unknown>;
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
  }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [portals, setPortals] = useState<ReactPortal[]>([]);

    const [pendingCallbacks, setPendingCallbacks] = useState<(() => void)[]>(
      []
    );

    const hydrate = useCallback(
      async (args: {
        $element: HTMLDivElement;
        component: string;
        reason: any;
        callback?: () => void;
      }) => {
        const { $element, component, reason, callback } = args;

        if (loadedNestedsMap.has($element)) return;

        console.debug(
          "Hydrating",
          $element,
          "due to:",
          ...(Array.isArray(reason) ? reason : [reason])
        );

        loadedNestedsMap.set($element, true);

        $element.dataset.loading = "true";

        const Comp: ComponentType<{
          reactiveHydrateId?: string;
          reactiveHydratePortalState?: Record<string, any>;
        }> = await importComponent(component);

        const reactiveHydrateId = $element.dataset.id;

        const portalState: Record<string, any> = {};

        let handledIds: string[] = [];

        let $currentComponent: HTMLElement | null = $element;
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

          const $nextComponent = $element.querySelector<HTMLElement>(
            nextComponentSelector
          );

          if ($currentComponent.contains($nextComponent)) {
            previousComponentIndexByName = new Map();
          }

          $currentComponent = $nextComponent;
        }

        const $newElement = document.createElement("div");

        const dataset = { ...$element.dataset };

        console.log("*** dataset", dataset);
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
        let $context: HTMLElement | null | undefined = $element;

        while (true) {
          const $previous: HTMLElement | null | undefined = $context;

          $context = $context?.closest<HTMLElement>("[data-context-value]");

          if ($context === $previous) {
            $context = $context.parentElement;
          }

          if (!$context) break;

          $contexts.push($context);
        }

        let componentry = (
          <Comp
            reactiveHydrateId={reactiveHydrateId}
            reactiveHydratePortalState={portalState}
          />
        );

        if ($contexts.length) {
          const contexts = (
            await Promise.all(
              $contexts.map(async ($context) => {
                const contextName = $context?.dataset.contextName;
                const contextValue = $context?.dataset.contextValue;

                if (!contextName) return;
                if (!contextValue) return;

                return {
                  value: JSON.parse(contextValue),
                  context: await importContext(contextName),
                };
              })
            )
          ).filter(truthy);

          contexts.forEach((context) => {
            componentry = (
              <context.context.DefaultProvider
                Context={context.context}
                serializedValue={context.value}
              >
                {componentry}
              </context.context.DefaultProvider>
            );
          });
        }

        setPortals((ps) => [...ps, createPortal(componentry, $newElement)]);

        // TODO: Move into separate effect so it's guaranteed to run only after portals are rendered into component tree?
        // This would avoid any flickering of empty DOM.
        // And ensure click callbacks fire after new portal is inserted into DOM.
        setTimeout(() => {
          $element.replaceWith($newElement);
        });
      },
      []
    );

    useEffect(() => {
      if (!pendingCallbacks.length) return;

      const callbacks = pendingCallbacks;

      setPendingCallbacks([]);

      // TODO: This may be a bit of a race condition and cause clicks to not register?
      setTimeout(() => {
        callbacks.forEach((callback) => callback());
      });
    }, [portals, pendingCallbacks]);

    const [allNesteds, setAllNesteds] = useState<
      {
        component: string;
        states?: State<unknown>[];
        $nested: HTMLDivElement;
      }[]
    >([]);

    // TODO: Handle async atoms/selectors/promises?

    const allNestedValuesAtom = useRecoilValue(
      useMemo(
        () =>
          selector({
            key: "allNestedValuesAtom" + Math.random(),
            get: ({ get }) =>
              allNesteds
                .map(
                  (nested) =>
                    nested.states?.map((state) => get(state)).join(",") ?? ""
                )
                .join("|"),
          }),
        [allNesteds]
      )
    );

    useEffect(() => {
      // State has changed - we must load!

      allNesteds.forEach((nested) => {
        const { component, states, $nested } = nested;

        // TODO: When not debugging, this could be faster with `.some`.
        const statesChanged = states?.filter(
          (state) => state.init !== getRecoil(state)
        );

        if (!statesChanged?.length) {
          return;
        }

        const reason = `state(s) changed: ${statesChanged
          .map((state) => state.key)
          .join(", ")}`;

        hydrate({ $element: $nested, component, reason: [reason] });
      });
    }, [allNestedValuesAtom, allNesteds, hydrate]);

    useEffect(() => {
      if (!ref.current) return;

      const $nesteds =
        ref.current.querySelectorAll<HTMLDivElement>("[data-component]");

      const newAllNesteds = Array.from($nesteds)
        .map(($nested) => {
          const id = $nested.dataset.id;

          // TODO: Also check a global variable tracking any clicks by ID that occur
          // before full JS hydration, using inline onclick listeners in the SSR HTML.
          const clicksSelector = "[data-click]";

          const $clicks = $nested.querySelectorAll<HTMLElement>(clicksSelector);

          $clicks.forEach(($click) => {
            if (clicksMap.has($click)) return;

            const closestId =
              $click.closest<HTMLElement>("[data-id]")?.dataset.id;

            if (closestId !== id) return;

            clicksMap.set($click, true);

            $click.addEventListener("click", () => {
              const component = $nested.dataset.component;

              // const id = $nested.dataset.id;

              if (!component) return;

              // const clickId = $click.dataset.click;

              const clickPath = domElementPath($click);

              hydrate({
                $element: $nested,
                component,
                reason: ["clicked", $click],
                callback: () => {
                  // const $portal = document.querySelector(
                  //   `[data-id="${id}"]`
                  // );

                  // console.log("*** $portal", $portal);

                  // if (!$portal) return;

                  // const newId = ($portal.children[0] as HTMLDivElement).dataset
                  //   .id;

                  // const postClickSelector = `[data-id="${newId}"][data-click="${clickId}"]`;

                  // console.log("*** postClickSelector", postClickSelector);

                  // TODO: To help avoid issues with hydration mismatch, would it be more stable
                  // to track by component path & index (like state) rather than by `domElementPath`?

                  const $postClick =
                    document.querySelector<HTMLElement>(clickPath);

                  if (!$postClick) {
                    console.error(
                      "Could not find element to click by path:",
                      clickPath
                    );
                  }

                  // TODO: Handle missing element target? Maybe something else in DOM changed during load.

                  $postClick?.click();
                },
              });
            });
          });

          const stateNames = $nested.dataset.states?.split(",");

          const states = stateNames
            ?.map((stateName: string) => getRegisteredState(stateName))
            // TODO: Handle unresolved state references with error?
            .filter(truthy);

          if (!states?.length) return;

          return {
            $nested,
            // TODO: Handle the component name data attribute not existing with error?
            component: $nested.dataset.component ?? "",
            states,
          };
        })
        .filter(truthy);

      setAllNesteds((a) => [...a, ...newAllNesteds]);
    }, [hydrate]);

    if (typeof window !== "object" && Comp) {
      return (
        // This `div` wrapper matches the suppress hydration `div` below to avoid hydration mismatch.
        <div>
          <Comp />
        </div>
      );
    }

    if (
      typeof window === "object" &&
      (window.location.href !== initialUrl || isSoftRouting)
    ) {
      isSoftRouting = true;

      return (
        <div>
          <LazyComp />
        </div>
      );
    }

    return (
      <>
        {/* Suppress hydration since we won't be loading the component on client. */}
        <div
          dangerouslySetInnerHTML={{
            __html: "",
          }}
          ref={ref}
          suppressHydrationWarning
        />

        {portals}
      </>
    );
  },
  () => true
);

ReactiveHydrationContainer.displayName = "ReactiveHydrationContainer";

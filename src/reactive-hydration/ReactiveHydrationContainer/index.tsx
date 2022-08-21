import { useCallback, useMemo } from "react";
import { atom, useAtom } from "jotai";
import { readAtom } from "jotai-nexus";
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
import { getRegisteredState, State } from "state/registry";
import { truthy } from "utilities/truthy";

const loadedNestedsMap = new WeakMap();

const clicksMap = new WeakMap();

let initialUrl = typeof window === "object" ? window.location.href : undefined;
let isSoftRouting = false;

export const ReactiveHydrationContainer = memo(
  ({
    Comp,
    LazyComp,
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

        $element.dataset.loaded = "true";

        // TODO: More robust relative import path?
        const Comp = await import(
          /* webpackChunkName: "client-components/[request]" */
          `../../components/${component}`
        ).then((mod) => mod[component]);

        const $portal = $element.parentElement;

        if (!$portal) return;

        const portalState: Record<string, any> = {};

        let handledIds: string[] = [];

        let $currentComponent =
          $portal.querySelector<HTMLElement>("[data-component]");
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

          const $nextComponent = $portal.querySelector<HTMLElement>(
            nextComponentSelector
          );

          if ($currentComponent.contains($nextComponent)) {
            previousComponentIndexByName = new Map();
          }

          $currentComponent = $nextComponent;
        }

        const $newPortal = document.createElement("div");
        $newPortal.dataset.portal = "true";
        $newPortal.dataset.id = $portal.dataset.id;

        if (callback) {
          setPendingCallbacks((p) => [...p, callback]);
        }

        const reactiveHydrateId = $portal.dataset.id;

        setPortals((ps) => [
          ...ps,
          createPortal(
            <Comp
              reactiveHydrateId={reactiveHydrateId}
              reactiveHydratePortalState={portalState}
            />,
            $newPortal
          ),
        ]);

        // TODO: Move into separate effect so it's guaranteed to run only after portals are rendered into component tree?
        // This would avoid any flickering of empty DOM.
        setTimeout(() => {
          $portal.replaceWith($newPortal);
        });
      },
      []
    );

    useEffect(() => {
      if (!pendingCallbacks.length) return;

      pendingCallbacks.forEach((callback) => callback());

      setPendingCallbacks([]);
    }, [portals, pendingCallbacks]);

    const [allNesteds, setAllNesteds] = useState<
      {
        component: string;
        states?: State<unknown>[];
        $nested: HTMLDivElement;
      }[]
    >([]);

    const allNestedValuesAtom = useAtom(
      useMemo(
        () =>
          atom((get) =>
            allNesteds
              .map(
                (nested) =>
                  nested.states?.map((state) => get(state)).join(",") ?? ""
              )
              .join("|")
          ),
        [allNesteds]
      )
    );

    useEffect(() => {
      // State has changed - we must load!

      allNesteds.forEach((nested) => {
        const { component, states, $nested } = nested;

        // TODO: When not debugging, this could be faster with `.some`.
        const statesChanged = states?.filter(
          (state) => state.init !== readAtom(state)
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

          const clicksSelector = "[data-click]";

          const $clicks = $nested.querySelectorAll<HTMLElement>(clicksSelector);

          $clicks.forEach(($click) => {
            if (clicksMap.has($click)) return;

            const closestId =
              $click.closest<HTMLElement>("[data-id]")?.dataset.id;

            if (closestId !== id) return;

            clicksMap.set($click, true);

            $click.addEventListener("click", () => {
              const componentOrAncestorComponent = $nested.dataset.component;

              // const id = $nested.dataset.id;

              if (!componentOrAncestorComponent) return;

              // const clickId = $click.dataset.click;

              const clickPath = domElementPath($click);

              hydrate({
                $element: $nested,
                component: componentOrAncestorComponent,
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

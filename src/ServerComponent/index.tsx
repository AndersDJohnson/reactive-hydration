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
import { getRegisteredState, State } from "../state/registry";
import { truthy } from "../utilities/truthy";

const loadedNestedsMap = new WeakMap();
const clicksMap = new WeakMap();

export const ServerComponent = memo(
  ({ Comp }: { Comp: ComponentType<unknown> | undefined }) => {
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

        console.debug("Hydrating", $element, "due to:", reason);

        loadedNestedsMap.set($element, true);

        $element.dataset.loaded = "true";

        // TODO: More robust relative import path?
        const Comp = await import(
          /* webpackChunkName: "client-components/[request]" */
          `../components/${component}`
        ).then((mod) => mod[component]);

        const $portal = $element.parentElement;

        if (!$portal) return;

        // TODO: Remove children more performantly (e.g., `removeChild` loop)
        $portal.innerHTML = "";

        if (callback) {
          setPendingCallbacks((p) => [...p, callback]);
        }

        setPortals((ps) => [...ps, createPortal(<Comp />, $portal)]);
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

      const parentsMap = new Map<
        HTMLDivElement,
        {
          states?: State<any>[];
        }
      >();

      $nesteds.forEach(($nested) => {
        const id = $nested.dataset.id;

        const stateNames = $nested.dataset.states?.split(",");

        const states = stateNames
          ?.map((stateName: string) => getRegisteredState(stateName))
          // TODO: Handle unresolved state references with error?
          .filter(truthy);

        const $clicks = $nested.querySelectorAll<HTMLElement>(
          `[data-id="${id}"][data-click]`
        );

        $clicks.forEach(($click) => {
          if (clicksMap.has($click)) return;

          clicksMap.set($click, true);

          $click.addEventListener("click", () => {
            const component = $nested.dataset.component;
            const clickId = $click.dataset.click;

            if (!component) return;

            hydrate({
              $element: $nested,
              component,
              reason: ["clicked", $click],
              callback: () => {
                console.log("*** callback");
                document
                  .querySelector<HTMLElement>(`[data-click="${clickId}"]`)
                  ?.click();
              },
            });
          });
        });

        if (!states?.length) return;

        const containingParent = Array.from(parentsMap.keys()).find(($parent) =>
          $parent.contains($nested)
        );

        if (containingParent) {
          console.debug(
            "Including nested with parent:",
            $nested,
            containingParent
          );

          const parentValue = parentsMap.get(containingParent);

          if (parentValue && states) {
            parentValue.states = parentValue.states
              ? [...parentValue.states, ...states]
              : states;
          }

          return;
        }

        parentsMap.set($nested, { states });
      });

      const newAllNesteds = Array.from(parentsMap.entries()).map(
        ([$nested, { states }]) => ({
          $nested,
          // TODO: Handle the component name data attribute not existing with error?
          component: $nested.dataset.component ?? "",
          states,
        })
      );

      setAllNesteds((a) => [...a, ...newAllNesteds]);
    }, []);

    // The component will only be passed to us on server-side render.
    if (Comp) {
      return (
        // This `div` wrapper matches the suppress hydration `div` below to avoid hydration mismatch.
        <div>
          <Comp />
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

ServerComponent.displayName = "ServerComponent";

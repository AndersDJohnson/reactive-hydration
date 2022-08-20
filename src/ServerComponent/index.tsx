import { useMemo } from "react";
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
import { AtomWithInit, getRegisteredState } from "../state/registry";
import { truthy } from "../utilities/truthy";

const loadedNestedsMap = new WeakMap();

export const ServerComponent = memo(
  ({ Comp }: { Comp: ComponentType<unknown> | undefined }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [portals, setPortals] = useState<ReactPortal[]>([]);

    const [allNesteds, setAllNesteds] = useState<
      {
        component: string;
        states: AtomWithInit<unknown>[];
        $nested: HTMLDivElement;
      }[]
    >([]);

    const allNestedValuesAtom = useAtom(
      useMemo(
        () =>
          atom((get) =>
            allNesteds
              .map((nested) =>
                nested.states.map((state) => get(state)).join(",")
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
        const statesChanged = states.filter(
          (state) => state.init !== readAtom(state)
        );

        if (!statesChanged.length) {
          return;
        }

        (async () => {
          if (loadedNestedsMap.has($nested)) return;

          console.log(
            "Hydrating due to state(s) changed:",
            statesChanged.map((state) => state.key).join(", "),
            $nested
          );

          loadedNestedsMap.set($nested, true);

          $nested.dataset.loaded = "true";

          // TODO: More robust relative import path?
          const Comp = await import(
            /* webpackChunkName: "client-components/[request]" */
            `../components/${component}`
          ).then((mod) => mod[component]);

          // TODO: Remove children more performantly (e.g., `removeChild` loop)
          $nested.innerHTML = "";

          setPortals((ps) => [...ps, createPortal(<Comp />, $nested)]);
        })();
      });
    }, [allNestedValuesAtom, allNesteds]);

    useEffect(() => {
      if (!ref.current) return;

      const $nesteds =
        ref.current.querySelectorAll<HTMLDivElement>("[data-component]");

      const newAllNesteds = Array.from($nesteds)
        .map(($nested) => {
          const component = $nested.dataset.component;

          if (!component) return;

          const stateNames = $nested.dataset.states?.split(",");

          const states = stateNames
            ?.map((stateName: string) => getRegisteredState(stateName))
            // TODO: Handle unresolved state references with error?
            .filter(truthy);

          if (!states) return;

          return {
            $nested,
            component,
            states,
          };
        })
        .filter(truthy);

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

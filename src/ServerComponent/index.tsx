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
        file: string;
        states: AtomWithInit<unknown>[];
        $nested: HTMLDivElement;
      }[]
    >([]);

    console.log("*** allNesteds", allNesteds);

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
      console.log("*** allNesteds", allNesteds);

      // State has changed - we must load!

      allNesteds.forEach((nested) => {
        const { file, states, $nested } = nested;

        const haveAnyStatesChanged = states.some(
          (state) => state.init !== readAtom(state)
        );

        if (!haveAnyStatesChanged) {
          return;
        }

        (async () => {
          if (loadedNestedsMap.has($nested)) return;

          loadedNestedsMap.set($nested, true);

          $nested.dataset.loaded = "true";

          // TODO: More robust relative import path?
          const Comp = await import(`../components/${file}`).then(
            (mod) => mod[file]
          );

          console.log("*** Comp", Comp);

          // TODO: Remove children more performantly (e.g., `removeChild` loop)
          $nested.innerHTML = "";

          setPortals((ps) => [...ps, createPortal(<Comp />, $nested)]);
        })();
      });
    }, [allNestedValuesAtom, allNesteds]);

    useEffect(() => {
      if (!ref.current) return;

      const $nesteds =
        ref.current.querySelectorAll<HTMLDivElement>("[data-file]");

      console.log("*** $nesteds", $nesteds);

      const newAllNesteds = Array.from($nesteds)
        .map(($nested) => {
          console.log("*** $nested", $nested);

          console.log("*** $nested.dataset.file", $nested.dataset.file);
          console.log("*** $nested.dataset.states", $nested.dataset.states);

          // TODO: Don't re-replace after hydration.
          // if (loaded) return;

          const file = $nested.dataset.file;

          if (!file) return;

          const stateNames = $nested.dataset.states?.split(",");

          const states = stateNames
            ?.map((stateName: string) => getRegisteredState(stateName))
            // TODO: Handle unresolved state references with error?
            .filter(truthy);

          if (!states) return;

          console.log("*** states", states);

          return {
            $nested,
            file,
            states,
          };
        })
        .filter(truthy);

      setAllNesteds((a) => [...a, ...newAllNesteds]);
    }, []);

    // It will be passed on the server.
    if (Comp) {
      return (
        <>
          <div>
            <Comp />
          </div>
        </>
      );
    }

    return (
      <>
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

import { useMemo, useEffect, RefObject } from "react-actual";
import { useState } from "../../react-actual";
import { useRecoilValue, selector } from "recoil";
import { getRecoil } from "recoil-nexus";
import { getRegisteredState, State } from "../../stateRegistry";
import { truthy } from "../../utilities/truthy";
import { Hydrate } from "../types";

interface UsePluginRecoilArgs {
  hydrate: Hydrate;
  containerRef: RefObject<HTMLElement>;
}

// TODO: Instead of requiring component state annotations, monkeypatch `useAtom` to detect and track similar to `useContextUsageTracker`.
export const usePluginRecoil = (args: UsePluginRecoilArgs) => {
  const { hydrate, containerRef } = args;

  const [allNesteds, setAllNesteds] = useState<
    {
      states?: State<unknown>[];
      $component: HTMLElement;
    }[]
  >([]);

  // TODO: Handle async atoms/selectors/promises?

  // TODO: We may be able to detect initial value dynamically,
  // and then not require `init` values on the atoms in the registry.
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
      const { states, $component } = nested;

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

      hydrate({ $component: $component, reason: [reason] });
    });
  }, [allNestedValuesAtom, allNesteds, hydrate]);

  useEffect(() => {
    // TODO: Effects should not short circuit on refs - refactor to ref callback.

    const $components =
      containerRef.current?.querySelectorAll<HTMLElement>("[data-component]");

    if (!$components) return;

    const newAllNesteds = Array.from($components)
      .map(($component) => {
        const initRecoil = $component.dataset?.initRecoil;
        if (initRecoil === "true") return;
        $component.dataset.initRecoil = "true";

        const id = $component.dataset.id;
        const component = $component.dataset.component;
        const loaded = $component.dataset.loaded;

        if (!id) return;
        if (!component) return;

        if (loaded === "true") return;

        const stateNames = $component.dataset.states?.split(",");

        const states = stateNames
          ?.map((stateName: string) => getRegisteredState(stateName))
          // TODO: Handle unresolved state references with error?
          .filter(truthy);

        if (!states?.length) return;

        return {
          $component,
          states,
        };
      })
      .filter(truthy);

    setAllNesteds((a) => [...a, ...newAllNesteds]);
  }, [hydrate, containerRef]);
};

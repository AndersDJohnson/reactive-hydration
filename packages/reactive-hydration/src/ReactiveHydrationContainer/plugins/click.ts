import domElementPath from "dom-element-path";
import { Hydrate } from "../types";

interface Args {
  $container: HTMLElement;
  hydrate: Hydrate;
}

// TODO: Also check a global variable tracking any clicks by ID that occur
// before full JS hydration, using inline onclick listeners in the SSR HTML.

const clickedIdsMap = new Map<string, boolean>();

const clicksSelector = "[data-click]";

export const pluginClick = (args: Args) => {
  const { $container, hydrate } = args;

  const handler = (event: MouseEvent) => {
    const $target = event.target;

    if (!$target) return;
    if (!($target as HTMLElement).matches) return;

    const $click = $target as HTMLElement;

    if (!$click.matches(clicksSelector)) return;

    const closestId = $click.closest<HTMLElement>("[data-id]")?.dataset.id;

    const $component = $container.querySelector<HTMLElement>(
      `[data-component][data-id="${closestId}"]`
    );

    if (!$component) return;

    const id = $component.dataset.id;
    const loaded = $component.dataset.loaded;

    // Don't re-hydrate - would cause infinite loops.
    if (loaded === "true") return;

    if (!id) return;

    if (clickedIdsMap.has(id)) return;

    clickedIdsMap.set(id, true);

    // const clickId = $click.dataset.click;

    const clickPath = domElementPath($click);

    hydrate({
      $component,
      reason: ["clicked", $click],
      callback: () => {
        // const $portal = document.querySelector(
        //   `[data-id="${id}"]`
        // );
        // console.log("*** $portal", $portal);
        // if (!$portal) return;
        // const newId = ($portal.children[0] as HTMLElement).dataset
        //   .id;
        // const postClickSelector = `[data-id="${newId}"][data-click="${clickId}"]`;
        // console.log("*** postClickSelector", postClickSelector);

        // TODO: To help avoid issues with hydration mismatch, would it be more stable
        // to track by component path & index (like state) rather than by `domElementPath`?
        const $postClick = document.querySelector<HTMLElement>(clickPath);

        if (!$postClick) {
          console.error("Could not find element to click by path:", clickPath);
        }

        // TODO: Handle missing element target? Maybe something else in DOM changed during load.
        $postClick?.click();
      },
    });
  };

  $container.addEventListener("click", handler);
};

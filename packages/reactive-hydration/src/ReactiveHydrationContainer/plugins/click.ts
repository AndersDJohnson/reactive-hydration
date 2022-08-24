import domElementPath from "dom-element-path";
import { Hydrate } from "../types";

const clicksMap = new WeakMap();

interface Args {
  $component: HTMLElement;
  hydrate: Hydrate;
  name: string;
  id: string;
}

export const pluginClick = (args: Args) => {
  const { $component, hydrate, name, id } = args;

  // TODO: Also check a global variable tracking any clicks by ID that occur
  // before full JS hydration, using inline onclick listeners in the SSR HTML.
  const clicksSelector = "[data-click]";

  const $clicks = $component.querySelectorAll<HTMLElement>(clicksSelector);

  $clicks.forEach(($click) => {
    if (clicksMap.has($click)) return;

    const closestId = $click.closest<HTMLElement>("[data-id]")?.dataset.id;

    if (closestId !== id) return;

    clicksMap.set($click, true);

    $click.addEventListener("click", () => {
      // const clickId = $click.dataset.click;

      const clickPath = domElementPath($click);

      hydrate({
        $component,
        name,
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
};

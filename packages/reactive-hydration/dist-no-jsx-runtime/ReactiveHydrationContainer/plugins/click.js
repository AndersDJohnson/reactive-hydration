"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginClick = void 0;
var dom_element_path_1 = __importDefault(require("dom-element-path"));
var clicksMap = new WeakMap();
var pluginClick = function (args) {
    var $component = args.$component, hydrate = args.hydrate, id = args.id;
    // TODO: Also check a global variable tracking any clicks by ID that occur
    // before full JS hydration, using inline onclick listeners in the SSR HTML.
    var clicksSelector = "[data-click]";
    var $clicks = $component.querySelectorAll(clicksSelector);
    $clicks.forEach(function ($click) {
        var _a;
        if (clicksMap.has($click))
            return;
        var closestId = (_a = $click.closest("[data-id]")) === null || _a === void 0 ? void 0 : _a.dataset.id;
        if (closestId !== id)
            return;
        clicksMap.set($click, true);
        $click.addEventListener("click", function () {
            // const clickId = $click.dataset.click;
            var clickPath = (0, dom_element_path_1.default)($click);
            hydrate({
                $component: $component,
                reason: ["clicked", $click],
                callback: function () {
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
                    var $postClick = document.querySelector(clickPath);
                    if (!$postClick) {
                        console.error("Could not find element to click by path:", clickPath);
                    }
                    // TODO: Handle missing element target? Maybe something else in DOM changed during load.
                    $postClick === null || $postClick === void 0 ? void 0 : $postClick.click();
                },
            });
        });
    });
};
exports.pluginClick = pluginClick;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginContext = void 0;
var pluginContext = function (args) {
    var _a, _b;
    var $component = args.$component, hydrate = args.hydrate, contextHydratorsByContextId = args.contextHydratorsByContextId;
    var contextNames = (_b = (_a = $component
        .querySelector(
    // TODO: Check browser support for `:scope` selector.
    ":scope > [data-contexts]")) === null || _a === void 0 ? void 0 : _a.dataset.contexts) === null || _b === void 0 ? void 0 : _b.split(",");
    contextNames === null || contextNames === void 0 ? void 0 : contextNames.forEach(function (contextName) {
        var _a;
        var $context = $component.closest("[data-context-name=\"".concat(contextName, "\"]"));
        if (!$context)
            return;
        var contextId = (_a = $context.dataset) === null || _a === void 0 ? void 0 : _a.contextId;
        if (!contextId)
            return;
        var contextHydrators = contextHydratorsByContextId.get(contextId);
        if (!contextHydrators) {
            contextHydrators = [];
            contextHydratorsByContextId.set(contextId, contextHydrators);
        }
        var hydrator = function () {
            hydrate({
                $component: $component,
                reason: ["context (by SSR ID)", contextName],
            });
        };
        hydrator.$component = $component;
        hydrator.$context = $context;
        contextHydrators.push(hydrator);
    });
};
exports.pluginContext = pluginContext;

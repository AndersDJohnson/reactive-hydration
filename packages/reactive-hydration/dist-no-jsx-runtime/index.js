"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveHydrationInnardsContext = exports.ReactiveHydrationContainerContext = exports.ReactiveHydrateContextProvider = exports.ReactiveHydrationContainer = exports.registerState = exports.createContextWithDefaultValue = exports.reactiveHydrate = void 0;
var ReactiveHydrate_1 = require("./ReactiveHydrate");
Object.defineProperty(exports, "reactiveHydrate", { enumerable: true, get: function () { return ReactiveHydrate_1.reactiveHydrate; } });
var createContextWithDefaultValue_1 = require("./createContextWithDefaultValue");
Object.defineProperty(exports, "createContextWithDefaultValue", { enumerable: true, get: function () { return createContextWithDefaultValue_1.createContextWithDefaultValue; } });
var stateRegistry_1 = require("./stateRegistry");
Object.defineProperty(exports, "registerState", { enumerable: true, get: function () { return stateRegistry_1.registerState; } });
var ReactiveHydrationContainer_1 = require("./ReactiveHydrationContainer");
Object.defineProperty(exports, "ReactiveHydrationContainer", { enumerable: true, get: function () { return ReactiveHydrationContainer_1.ReactiveHydrationContainer; } });
// TODO: Do we really need to export this?
var ReactiveHydrateContext_1 = require("./ReactiveHydrateContext");
Object.defineProperty(exports, "ReactiveHydrateContextProvider", { enumerable: true, get: function () { return ReactiveHydrateContext_1.ReactiveHydrateContextProvider; } });
var ReactiveHydrationContainerContext_1 = require("./ReactiveHydrationContainerContext");
Object.defineProperty(exports, "ReactiveHydrationContainerContext", { enumerable: true, get: function () { return ReactiveHydrationContainerContext_1.ReactiveHydrationContainerContext; } });
var ReactiveHydrationInnardsContext_1 = require("./ReactiveHydrationInnardsContext");
Object.defineProperty(exports, "ReactiveHydrationInnardsContext", { enumerable: true, get: function () { return ReactiveHydrationInnardsContext_1.ReactiveHydrationInnardsContext; } });
if (typeof global !== "undefined") {
    // @ts-expect-error
    if (global.ReactiveHydrationSingleton) {
        module.exports =
            // @ts-expect-error
            global.ReactiveHydrationSingleton;
    }
    else {
        // @ts-expect-error
        global.ReactiveHydrationSingleton = exports;
    }
}

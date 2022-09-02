"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveHydrationContainerInner = void 0;
// var jsx_runtime_1 = require("react/jsx-runtime");
var _react_1 = require("_react");
var react_actual_1 = require("../react-actual");
var react_dom_1 = require("react-dom");
var truthy_1 = require("../utilities/truthy");
var makeContextDefaultProviderWrapper_1 = require("../makeContextDefaultProviderWrapper");
var click_1 = require("./plugins/click");
var ContextPortalTreeRenderer_1 = require("./ContextPortalTreeRenderer");
var recoil_1 = require("./plugins/recoil");
var context_1 = require("./plugins/context");
var ReactiveHydrationInnardsContext_1 = require("../ReactiveHydrationInnardsContext");
var hydratedComponentsMap = new Map();
var ContextDefaultProviderWrapperByContextElement = new Map();
exports.ReactiveHydrationContainerInner = (0, _react_1.memo)(function (props) {
    var _a;
    var importComponent = props.importComponent, importContext = props.importContext;
    var componentRef = (0, _react_1.useRef)(null);
    var _b = __read((0, react_actual_1.useState)(function () { return new Map(); }), 1), contextPortalTree = _b[0];
    var _c = __read((0, react_actual_1.useState)(function () { return new Set(); }), 1), topmostContextPortalTreeEntries = _c[0];
    var _d = __read((0, react_actual_1.useState)(function () { return []; }), 1), contextFreePortals = _d[0];
    var _e = __read((0, react_actual_1.useState)(function () { return ({}); }), 2), forcedRender = _e[0], setForcedRender = _e[1];
    var forceRender = (0, _react_1.useCallback)(function () { return setForcedRender({}); }, []);
    var _f = __read((0, react_actual_1.useState)(function () { return []; }), 2), pendingCallbacks = _f[0], setPendingCallbacks = _f[1];
    var _g = __read((0, react_actual_1.useState)(function () { return new Map(); }), 1), contextHydratorsByContextId = _g[0];
    var getSetContextValueByContextElement = (0, _react_1.useCallback)(function ($context) { return function (value) {
        var _a;
        var serializedCurrentValue = $context.dataset.contextValue;
        var contextId = $context.dataset.contextId;
        if (!contextId)
            return;
        var serializedNewValue = JSON.stringify(value);
        if (serializedNewValue === serializedCurrentValue)
            return;
        $context.dataset.contextValue = serializedNewValue;
        __spreadArray([], __read(((_a = contextHydratorsByContextId.get(contextId)) !== null && _a !== void 0 ? _a : [])), false).forEach(function (hydrator) {
            if (hydrator.$context) {
                hydrator.$context.dataset.contextValue = serializedNewValue;
            }
            hydrator();
        });
    }; }, [contextHydratorsByContextId]);
    var hydrate = (0, _react_1.useCallback)(function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var $component, reason, callback, id, name, ImportedComponent, hasHydratedAncestor, reactiveHydrateId, portalState, handledIds, $currentComponent, previousComponentIndexByName, currentName, currentId, currentSerializedStateSelector, currentSerializedStateElement, currentSerializedState, currentComponentIndex, currentStateKey, nextComponentSelector, $nextComponent, $newElement, dataset, _a, _b, _c, key_1, value, $contexts, $closestContext, $topmostContext, $context, contextPortalTreePath, $previous, previousId, contextId, contextName, contextPortalTreeEntryKey, contextPortalTreeEntry, previousContextPortalTreeEntry, topmostContextId, topmostContextPortalTreeEntry, contextMetas, portal, key, closestContextId, closestContextPortalTreeEntry;
        var e_1, _d;
        var _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    $component = args.$component, reason = args.reason, callback = args.callback;
                    id = (_e = $component.dataset) === null || _e === void 0 ? void 0 : _e.id;
                    name = (_f = $component.dataset) === null || _f === void 0 ? void 0 : _f.component;
                    if (!id)
                        return [2 /*return*/];
                    if (!name)
                        return [2 /*return*/];
                    if (hydratedComponentsMap.has($component))
                        return [2 /*return*/];
                    console.debug.apply(console, __spreadArray(["Hydrating",
                        name,
                        $component,
                        "due to:"], __read((Array.isArray(reason) ? reason : [reason])), false));
                    hydratedComponentsMap.set($component, true);
                    $component.dataset.loading = "true";
                    return [4 /*yield*/, importComponent(name)];
                case 1:
                    ImportedComponent = _j.sent();
                    hasHydratedAncestor = __spreadArray([], __read(hydratedComponentsMap.keys()), false).some(function ($hydratedComponent) {
                        return $hydratedComponent !== $component &&
                            $hydratedComponent.contains($component);
                    });
                    if (hasHydratedAncestor) {
                        if (callback) {
                            setPendingCallbacks(function (p) { return __spreadArray(__spreadArray([], __read(p), false), [callback], false); });
                        }
                        return [2 /*return*/];
                    }
                    reactiveHydrateId = $component.dataset.id;
                    portalState = {};
                    handledIds = [];
                    $currentComponent = $component;
                    previousComponentIndexByName = new Map();
                    while ($currentComponent) {
                        currentName = $currentComponent === null || $currentComponent === void 0 ? void 0 : $currentComponent.dataset.component;
                        if (!currentName)
                            continue;
                        currentId = $currentComponent === null || $currentComponent === void 0 ? void 0 : $currentComponent.dataset.id;
                        if (!currentId)
                            continue;
                        currentSerializedStateSelector = "[data-id=\"".concat(currentId, "\"][data-state]");
                        currentSerializedStateElement = $currentComponent === null || $currentComponent === void 0 ? void 0 : $currentComponent.querySelector(currentSerializedStateSelector);
                        currentSerializedState = currentSerializedStateElement === null || currentSerializedStateElement === void 0 ? void 0 : currentSerializedStateElement.dataset.state;
                        currentComponentIndex = ((_g = previousComponentIndexByName.get(currentName)) !== null && _g !== void 0 ? _g : -1) + 1;
                        previousComponentIndexByName.set(currentName, currentComponentIndex);
                        if (currentSerializedState) {
                            currentStateKey = "".concat(currentName, ".").concat(currentComponentIndex);
                            portalState[currentStateKey] = JSON.parse(currentSerializedState);
                        }
                        handledIds.push(currentId);
                        nextComponentSelector = "[data-component][data-id]".concat(handledIds
                            .map(function (hid) { return ":not([data-id=\"".concat(hid, "\"])"); })
                            .join(""));
                        $nextComponent = $component.querySelector(nextComponentSelector);
                        if ($currentComponent.contains($nextComponent)) {
                            previousComponentIndexByName = new Map();
                        }
                        $currentComponent = $nextComponent;
                    }
                    $newElement = document.createElement("div");
                    dataset = __assign({}, $component.dataset);
                    try {
                        for (_a = __values(Object.entries(dataset)), _b = _a.next(); !_b.done; _b = _a.next()) {
                            _c = __read(_b.value, 2), key_1 = _c[0], value = _c[1];
                            $newElement.dataset[key_1] = value;
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    $newElement.dataset.id = reactiveHydrateId;
                    $newElement.dataset.loading = "false";
                    $newElement.dataset.loaded = "true";
                    if (callback) {
                        setPendingCallbacks(function (p) { return __spreadArray(__spreadArray([], __read(p), false), [callback], false); });
                    }
                    $contexts = [];
                    $context = $component;
                    contextPortalTreePath = [];
                    // eslint-disable-next-line no-constant-condition -- We are handling carefully with `break` statements.
                    while (true) {
                        $previous = $context;
                        previousId = $previous === null || $previous === void 0 ? void 0 : $previous.dataset.contextId;
                        $context = $context === null || $context === void 0 ? void 0 : $context.closest("[data-context-value]");
                        if ($context) {
                            $topmostContext = $context;
                        }
                        if ($context === $previous) {
                            $context = $context.parentElement;
                        }
                        if (!$context)
                            break;
                        if (!$closestContext) {
                            $closestContext = $context;
                        }
                        contextId = $context === null || $context === void 0 ? void 0 : $context.dataset.contextId;
                        contextName = $context === null || $context === void 0 ? void 0 : $context.dataset.contextName;
                        if (!contextId)
                            break;
                        if (!contextName)
                            break;
                        contextPortalTreePath.push("".concat(contextName, "[").concat(contextId, "]"));
                        contextPortalTreeEntryKey = contextPortalTreePath.join(" > ");
                        contextPortalTreeEntry = contextPortalTree.get(contextId);
                        if (!contextPortalTreeEntry) {
                            contextPortalTreeEntry = {
                                key: contextPortalTreeEntryKey,
                                childPortalTreeEntries: [],
                                leafPortals: [],
                            };
                            contextPortalTree.set(contextId, contextPortalTreeEntry);
                        }
                        previousContextPortalTreeEntry = previousId
                            ? contextPortalTree.get(previousId)
                            : undefined;
                        if (previousContextPortalTreeEntry) {
                            contextPortalTreeEntry.childPortalTreeEntries.push(previousContextPortalTreeEntry);
                        }
                        $contexts.push($context);
                    }
                    if ($topmostContext) {
                        topmostContextId = $topmostContext === null || $topmostContext === void 0 ? void 0 : $topmostContext.dataset.contextId;
                        topmostContextPortalTreeEntry = topmostContextId
                            ? contextPortalTree.get(topmostContextId)
                            : undefined;
                        if (topmostContextPortalTreeEntry) {
                            topmostContextPortalTreeEntries.add(topmostContextPortalTreeEntry);
                        }
                    }
                    if (!$contexts.length) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all($contexts.map(function ($context) { return __awaiter(void 0, void 0, void 0, function () {
                            var contextName, serializedValue, Context, deserializedValue;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        contextName = $context === null || $context === void 0 ? void 0 : $context.dataset.contextName;
                                        serializedValue = $context === null || $context === void 0 ? void 0 : $context.dataset.contextValue;
                                        if (!contextName)
                                            return [2 /*return*/];
                                        if (!serializedValue)
                                            return [2 /*return*/];
                                        return [4 /*yield*/, importContext(contextName)];
                                    case 1:
                                        Context = _a.sent();
                                        deserializedValue = JSON.parse(serializedValue);
                                        return [2 /*return*/, {
                                                $context: $context,
                                                Context: Context,
                                                deserializedValue: deserializedValue,
                                            }];
                                }
                            });
                        }); }))];
                case 2:
                    contextMetas = (_j.sent()).filter(truthy_1.truthy);
                    contextMetas.forEach(function (contextMeta) {
                        var $context = contextMeta.$context, Context = contextMeta.Context, deserializedValue = contextMeta.deserializedValue;
                        var DefaultProvider = Context.DefaultProvider, Provider = Context.Provider;
                        var contextId = $context === null || $context === void 0 ? void 0 : $context.dataset.contextId;
                        if (!contextId)
                            return;
                        var contextPortalTreeEntry = contextPortalTree.get(contextId);
                        var ContextDefaultProviderWrapper = ContextDefaultProviderWrapperByContextElement.get($context);
                        if (!ContextDefaultProviderWrapper) {
                            var setContextValue = getSetContextValueByContextElement($context);
                            ContextDefaultProviderWrapper = (0, makeContextDefaultProviderWrapper_1.makeContextDefaultProviderWrapper)(contextId, Provider, deserializedValue, setContextValue);
                            ContextDefaultProviderWrapperByContextElement.set($context, ContextDefaultProviderWrapper);
                        }
                        if (contextPortalTreeEntry &&
                            !contextPortalTreeEntry.ContextWrapper) {
                            var ContextWrapper = function (props) { return ((0, global.jsx_runtime_1.jsx)(DefaultProvider, __assign({ Provider: ContextDefaultProviderWrapper, defaultValue: Context.defaultValue, deserializedValue: deserializedValue }, { children: props.children }), contextPortalTreeEntry.key)); };
                            ContextWrapper.displayName = "ContextWrapper";
                            contextPortalTreeEntry.ContextWrapper = ContextWrapper;
                        }
                    });
                    _j.label = 3;
                case 3:
                    portal = (0, react_dom_1.createPortal)((0, global.jsx_runtime_1.jsx)(ImportedComponent, { reactiveHydrateId: reactiveHydrateId, reactiveHydratePortalState: portalState }), $newElement);
                    key = __spreadArray(__spreadArray([], __read(contextPortalTreePath), false), ["".concat(name, "[").concat(id, "]")], false).join(" > ");
                    closestContextId = (_h = $closestContext === null || $closestContext === void 0 ? void 0 : $closestContext.dataset) === null || _h === void 0 ? void 0 : _h.contextId;
                    closestContextPortalTreeEntry = closestContextId
                        ? contextPortalTree.get(closestContextId)
                        : undefined;
                    if (closestContextPortalTreeEntry) {
                        closestContextPortalTreeEntry.leafPortals.push({
                            key: key,
                            portal: portal,
                        });
                    }
                    else {
                        contextFreePortals.push({
                            key: key,
                            portal: portal,
                        });
                    }
                    forceRender();
                    // TODO: Move into separate effect so it's guaranteed to run only after portals are rendered into component tree?
                    // This would avoid any flickering of empty DOM.
                    // And ensure click callbacks fire after new portal is inserted into DOM.
                    setTimeout(function () {
                        $component.replaceWith($newElement);
                    });
                    return [2 /*return*/];
            }
        });
    }); }, [
        contextFreePortals,
        contextPortalTree,
        forceRender,
        getSetContextValueByContextElement,
        importComponent,
        importContext,
        topmostContextPortalTreeEntries,
    ]);
    (0, _react_1.useEffect)(function () {
        if (!pendingCallbacks.length)
            return;
        var callbacks = pendingCallbacks;
        setPendingCallbacks([]);
        // TODO: This may be a bit of a race condition and cause clicks to not register?
        setTimeout(function () {
            callbacks.forEach(function (callback) { return callback(); });
        });
    }, [forcedRender, pendingCallbacks]);
    (0, _react_1.useEffect)(function () {
        var _a;
        var $components = (_a = componentRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll("[data-component]");
        if (!$components)
            return;
        $components.forEach(function ($component) {
            var _a;
            var init = (_a = $component.dataset) === null || _a === void 0 ? void 0 : _a.init;
            if (init === "true")
                return;
            $component.dataset.init = "true";
            var id = $component.dataset.id;
            var component = $component.dataset.component;
            if (!id)
                return;
            if (!component)
                return;
            (0, click_1.pluginClick)({
                $component: $component,
                id: id,
                hydrate: hydrate,
            });
            (0, context_1.pluginContext)({
                $component: $component,
                hydrate: hydrate,
                contextHydratorsByContextId: contextHydratorsByContextId,
            });
        });
    }, [hydrate, contextHydratorsByContextId]);
    (0, recoil_1.usePluginRecoil)({
        hydrate: hydrate,
        componentRef: componentRef,
    });
    return ((0, global.jsx_runtime_1.jsxs)(global.jsx_runtime_1.Fragment, { children: [(0, global.jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: {
                    __html: "",
                }, ref: componentRef, suppressHydrationWarning: true }), __spreadArray([], __read(((_a = topmostContextPortalTreeEntries === null || topmostContextPortalTreeEntries === void 0 ? void 0 : topmostContextPortalTreeEntries.values()) !== null && _a !== void 0 ? _a : [])), false).map(function (topmostContextPortalTreeEntry) { return ((0, global.jsx_runtime_1.jsx)(ContextPortalTreeRenderer_1.ContextPortalTreeRenderer, { contextPortalTreeEntry: topmostContextPortalTreeEntry }, topmostContextPortalTreeEntry.key)); }), contextFreePortals.map(function (portal) { return ((0, global.jsx_runtime_1.jsx)(ReactiveHydrationInnardsContext_1.ReactiveHydrationInnardsContext.Provider, __assign({ value: undefined }, { children: (0, global.jsx_runtime_1.jsx)(_react_1.Fragment, { children: portal.portal }, portal.key) }))); })] }));
}, 
// Never re-render only due to parent re-renders.
function () { return true; });
exports.ReactiveHydrationContainerInner.displayName = "ReactiveHydrationContainerInner";

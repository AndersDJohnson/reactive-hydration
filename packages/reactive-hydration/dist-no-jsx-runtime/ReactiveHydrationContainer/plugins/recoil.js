"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePluginRecoil = void 0;
var _react_1 = require("_react");
var react_actual_1 = require("../../react-actual");
var recoil_1 = require("recoil");
var recoil_nexus_1 = require("recoil-nexus");
var stateRegistry_1 = require("../../stateRegistry");
var truthy_1 = require("../../utilities/truthy");
// TODO: Instead of requiring component state annotations, monkeypatch `useAtom` to detect and track similar to `useContextUsageTracker`.
var usePluginRecoil = function (args) {
    var hydrate = args.hydrate, componentRef = args.componentRef;
    var _a = __read((0, react_actual_1.useState)([]), 2), allNesteds = _a[0], setAllNesteds = _a[1];
    // TODO: Handle async atoms/selectors/promises?
    // TODO: We may be able to detect initial value dynamically,
    // and then not require `init` values on the atoms in the registry.
    var allNestedValuesAtom = (0, recoil_1.useRecoilValue)((0, _react_1.useMemo)(function () {
        return (0, recoil_1.selector)({
            key: "allNestedValuesAtom" + Math.random(),
            get: function (_a) {
                var get = _a.get;
                return allNesteds
                    .map(function (nested) { var _a, _b; return (_b = (_a = nested.states) === null || _a === void 0 ? void 0 : _a.map(function (state) { return get(state); }).join(",")) !== null && _b !== void 0 ? _b : ""; })
                    .join("|");
            },
        });
    }, [allNesteds]));
    (0, _react_1.useEffect)(function () {
        // State has changed - we must load!
        allNesteds.forEach(function (nested) {
            var states = nested.states, $component = nested.$component;
            // TODO: When not debugging, this could be faster with `.some`.
            var statesChanged = states === null || states === void 0 ? void 0 : states.filter(function (state) { return state.init !== (0, recoil_nexus_1.getRecoil)(state); });
            if (!(statesChanged === null || statesChanged === void 0 ? void 0 : statesChanged.length)) {
                return;
            }
            var reason = "state(s) changed: ".concat(statesChanged
                .map(function (state) { return state.key; })
                .join(", "));
            hydrate({ $component: $component, reason: [reason] });
        });
    }, [allNestedValuesAtom, allNesteds, hydrate]);
    (0, _react_1.useEffect)(function () {
        var _a;
        var $components = (_a = componentRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll("[data-component]");
        if (!$components)
            return;
        var newAllNesteds = Array.from($components)
            .map(function ($component) {
            var _a, _b;
            var initRecoil = (_a = $component.dataset) === null || _a === void 0 ? void 0 : _a.initRecoil;
            if (initRecoil === "true")
                return;
            $component.dataset.initRecoil = "true";
            var id = $component.dataset.id;
            var component = $component.dataset.component;
            var loaded = $component.dataset.loaded;
            if (!id)
                return;
            if (!component)
                return;
            if (loaded === "true")
                return;
            var stateNames = (_b = $component.dataset.states) === null || _b === void 0 ? void 0 : _b.split(",");
            var states = stateNames === null || stateNames === void 0 ? void 0 : stateNames.map(function (stateName) { return (0, stateRegistry_1.getRegisteredState)(stateName); }).filter(truthy_1.truthy);
            if (!(states === null || states === void 0 ? void 0 : states.length))
                return;
            return {
                $component: $component,
                states: states,
            };
        })
            .filter(truthy_1.truthy);
        setAllNesteds(function (a) { return __spreadArray(__spreadArray([], __read(a), false), __read(newAllNesteds), false); });
    }, [hydrate, componentRef]);
};
exports.usePluginRecoil = usePluginRecoil;

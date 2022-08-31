"use strict";
/**
 * TypeScript-aware alternative to `.filter(Boolean)`.
 *
 * E.g., `array.filter(truthy)`
 *
 * From: https://github.com/microsoft/TypeScript/pull/29955#issuecomment-470062531
 *
 * @param value
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.truthy = void 0;
var truthy = function (value) { return Boolean(value); };
exports.truthy = truthy;

/**
 * TypeScript-aware alternative to `.filter(Boolean)`.
 *
 * E.g., `array.filter(truthy)`
 *
 * From: https://github.com/microsoft/TypeScript/pull/29955#issuecomment-470062531
 *
 * @param value
 */
export declare const truthy: <T extends unknown>(value: T) => value is Exclude<T, false | "" | 0 | null | undefined>;

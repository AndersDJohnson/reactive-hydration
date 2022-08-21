/**
 * TypeScript-aware alternative to `.filter(Boolean)`.
 *
 * E.g., `array.filter(truthy)`
 *
 * From: https://github.com/microsoft/TypeScript/pull/29955#issuecomment-470062531
 *
 * @param value
 */

export const truthy = <T extends any>(
  value: T
): value is Exclude<T, false | null | undefined | "" | 0> => Boolean(value);

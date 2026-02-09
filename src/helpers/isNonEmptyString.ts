/**
 * Type guard that checks if a value is a non-empty string.
 *
 * @param value - The value to check
 * @returns `true` if the value is a string with at least one character, `false` otherwise
 *
 * @example
 * ```typescript
 * isNonEmptyString('hello'); // true
 * isNonEmptyString('');      // false
 * isNonEmptyString(null);    // false
 * isNonEmptyString(123);     // false
 * ```
 */
const isNonEmptyString = (value: any): value is string => {
  return typeof value === 'string' && value.length > 0;
};

export default isNonEmptyString;

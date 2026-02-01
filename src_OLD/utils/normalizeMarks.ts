/**
 * Normalizes a marks object by removing falsy values (false, null, undefined).
 *
 * @param marks - An object containing mark properties with any values
 * @returns A new object containing only the marks with truthy values
 *
 * @example
 * ```typescript
 * const marks = { bold: true, italic: false, underline: null, color: 'red' };
 * const result = normalizeMarks(marks);
 * // Returns: { bold: true, color: 'red' }
 * ```
 */
const normalizeMarks = (marks: Record<string, any>): Record<string, any> => {
  const normalized: Record<string, any> = {};

  for (const [key, value] of Object.entries(marks)) {
    if (value !== false && value !== null && value !== undefined) {
      normalized[key] = value;
    }
  }

  return normalized;
};

export default normalizeMarks;

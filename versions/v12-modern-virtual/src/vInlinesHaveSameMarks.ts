/**
 * Compares two virtual inline elements to determine if they have identical marks.
 *
 * @param inlineA - The first virtual inline element to compare
 * @param inlineB - The second virtual inline element to compare
 * @returns `true` if both inlines have the same marks with identical values, `false` otherwise
 *
 * @remarks
 * This function performs a deep comparison of the marks objects:
 * - Returns `false` if the number of marks differs between the two inlines
 * - Returns `false` if any mark key exists in one inline but not the other
 * - Returns `false` if any mark value differs between the two inlines
 * - Returns `true` only when all marks and their values match exactly
 *
 * @example
 * ```typescript
 * const inline1 = { marks: { bold: true, italic: true } };
 * const inline2 = { marks: { bold: true, italic: true } };
 * vInlinesHaveSameMarks(inline1, inline2); // returns true
 *
 * const inline3 = { marks: { bold: true } };
 * vInlinesHaveSameMarks(inline1, inline3); // returns false
 * ```
 */
const vInlinesHaveSameMarks = (
  inlineA: VirtualInline,
  inlineB: VirtualInline,
): boolean => {
  // Get marks as entries
  const marksA = Object.entries(inlineA?.marks ?? {});
  const marksB = Object.entries(inlineB?.marks ?? {});
  // If different number of marks, not same
  if (marksA.length !== marksB.length) {
    return false;
  }
  // Check each mark key and value
  for (const [key, value] of marksA) {
    // If key not in inlineB, not same
    if (inlineB.marks.hasOwnProperty(key) === false) {
      return false;
    }
    // If value different, not same
    if (inlineB.marks[key] !== value) {
      return false;
    }
  }
  // All marks match
  return true;
};

export default vInlinesHaveSameMarks;

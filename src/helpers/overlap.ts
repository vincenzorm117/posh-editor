/**
 * Calculates the overlap between two numeric ranges.
 *
 * @param rangeA - The first range with start and end properties
 * @param rangeA.start - The starting point of the first range
 * @param rangeA.end - The ending point of the first range
 * @param rangeB - The second range with start and end properties
 * @param rangeB.start - The starting point of the second range
 * @param rangeB.end - The ending point of the second range
 * @returns The length of the overlapping region between the two ranges, or 0 if they don't overlap
 *
 * @example
 * ```typescript
 * overlap({ start: 0, end: 10 }, { start: 5, end: 15 }); // Returns 5
 * overlap({ start: 0, end: 5 }, { start: 10, end: 15 }); // Returns 0
 * ```
 */
const overlap = (
  rangeA: { start: number; end: number },
  rangeB: { start: number; end: number },
): number => {
  const start = Math.max(rangeA.start, rangeB.start);
  const end = Math.min(rangeA.end, rangeB.end);
  return Math.max(0, end - start);
};

export default overlap;

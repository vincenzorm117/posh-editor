/**
 * Combines two arrays into an array of tuples, pairing elements at corresponding indices.
 *
 * @template T - The type of elements in the first array
 * @template U - The type of elements in the second array
 *
 * @param {T[]} arr1 - The first array to zip
 * @param {U[]} arr2 - The second array to zip
 * @param {boolean} [useSmaller=true] - If true, uses the length of the shorter array; if false, uses the longer array
 *
 * @returns {[T, U][]} An array of tuples where each tuple contains corresponding elements from arr1 and arr2
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const letters = ['a', 'b', 'c'];
 * const zipped = zip(numbers, letters);
 * // Returns: [[1, 'a'], [2, 'b'], [3, 'c']]
 * ```
 *
 * @remarks
 * If the arrays have different lengths, the resulting array will have the length of the shorter array by default.
 * Set useSmaller to false to use the length of the longer array (undefined values may be included for the shorter array).
 */
const zip = <T, U>(arr1: T[], arr2: U[], useSmaller = true): [T, U][] => {
  // Determine length based on useSmaller flag
  const length = useSmaller
    ? Math.min(arr1.length, arr2.length)
    : Math.max(arr1.length, arr2.length);
  // Initialize result array
  const result: [T, U][] = [];
  // Zip elements from both arrays
  for (let i = 0; i < length; i++) {
    result.push([arr1[i], arr2[i]]);
  }
  // Return zipped array
  return result;
};

export default zip;

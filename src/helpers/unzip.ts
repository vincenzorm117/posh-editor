/**
 * Splits an array of tuples into two separate arrays, extracting elements at each position.
 *
 * @template T - The type of the first element in each tuple
 * @template U - The type of the second element in each tuple
 *
 * @param {[T, U][]} pairs - An array of tuples to unzip
 *
 * @returns {[T[], U[]]} A tuple containing two arrays: the first with all first elements, the second with all second elements
 *
 * @example
 * ```typescript
 * const zipped = [[1, 'a'], [2, 'b'], [3, 'c']] as const;
 * const [numbers, letters] = unzip(zipped);
 * // numbers: [1, 2, 3]
 * // letters: ['a', 'b', 'c']
 * ```
 *
 * @remarks
 * This is the inverse operation of zip. Given zip(arr1, arr2) = pairs, then unzip(pairs) = [arr1, arr2].
 */
const unzip = <T, U>(pairs: [T, U][]): [T[], U[]] => {
  const first: T[] = [];
  const second: U[] = [];

  for (const [a, b] of pairs) {
    first.push(a);
    second.push(b);
  }

  return [first, second];
};

export default unzip;

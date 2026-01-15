/**
 * Generates an array of sequential numbers starting from 0.
 * 
 * @param size - The length of the array to generate
 * @returns An array of numbers from 0 to size-1
 * 
 * @example
 * ```ts
 * generateArray(5); // Returns [0, 1, 2, 3, 4]
 * ```
 */
function generateArray(size: number) {
  return Array.from({ length: size }, (_, i) => i);
}
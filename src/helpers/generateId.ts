/**
 * Generates a random alphanumeric identifier string.
 *
 * Uses cryptographically secure random values to generate a string composed of
 * lowercase letters (a-z) and digits (0-9).
 *
 * @param length - The desired length of the generated ID. Defaults to 16 characters.
 * @returns A random alphanumeric string of the specified length.
 *
 * @example
 * ```typescript
 * const id = generateId(); // Returns a 16-character ID like "a3f9k2m8p1q7s4t6"
 * const shortId = generateId(8); // Returns an 8-character ID like "x2n5j9k1"
 * ```
 */
const generateId = (length = 16): string => {
  const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
  const BASE = ALPHABET.length; // 36

  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  let id = '';
  for (let i = 0; i < length; i++) {
    id += ALPHABET[bytes[i] % BASE];
  }
  return id;
};

export default generateId;

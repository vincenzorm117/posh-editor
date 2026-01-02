
/**
 * Finds the closest ancestor element that matches the specified selector.
 * Handles both element nodes and text nodes by traversing up the DOM tree.
 * 
 * @param {Node|null} node - The starting node to search from
 * @param {string} selector - CSS selector string to match against ancestor elements
 * @returns {Element|null} The closest ancestor element that matches the selector, or null if none found
 * 
 * @example
 * // Find closest list element
 * const div = closest(textNode, 'ul, ol');
 * 
 * @example
 * // Find closest element with class
 * const container = closest(element, '.container');
 */
const closest = (node, selector) => {
  if (node == null) return null;

  if (node.nodeType === Node.TEXT_NODE) {
    return node.parentElement.closest(selector);
  }
  return node.closest(selector);
};

export default closest;

import isTextNode from './isTextNode';

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
const closest = (node: Node | null, selector: string): Element | null => {
  if (node == null) return null;

  if (isTextNode(node) && node.parentElement != null) {
    return node.parentElement.closest(selector);
  }
  return (node as Element).closest(selector);
};

export default closest;

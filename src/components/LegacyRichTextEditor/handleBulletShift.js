/**
 * Handles indentation and outdentation of list items using Tab and Shift+Tab keys.
 * Allows users to create nested lists by pressing Tab to indent or Shift+Tab to outdent list items.
 * Only works when the cursor is positioned within a list item element.
 *
 * @param {Event} event - The keyboard event containing the key press information
 * @returns {void} This function doesn't return a value
 *
 * @example
 * // HTML before pressing Tab:
 * // <ul><li>Item 1</li></ul>
 * //
 * // After pressing Tab on the list item, it becomes indented:
 * // <ul><li><ul><li>Item 1</li></ul></li></ul>
 *
 * const editor = document.querySelector('[contenteditable]');
 * editor.addEventListener('keydown', handleBulletShift);
 */
const handleBulletShift = (event) => {
  const { nativeEvent } = event;
  // If not pressing Tab or Shift+Tab, do nothing
  if (nativeEvent.key !== "Tab") {
    return;
  }

  // Prevent the default tab behavior
  nativeEvent.preventDefault();

  // Get the current selection
  const selection = document.getSelection();
  if (!selection || !selection.rangeCount) return;

  // Get the range and start container
  const range = selection.getRangeAt(0);
  const node = range.startContainer;

  // Only process if we're in a list item
  const isInListItem =
    node.nodeType === 1 || node.parentElement.closest("li");
  if (!isInListItem) return;

  if (nativeEvent.shiftKey) {
    // Outdent the list item
    document.execCommand("outdent", false, null);
  } else {
    // Indent the list item
    document.execCommand("indent", false, null);
  }   
};

export default handleBulletShift;
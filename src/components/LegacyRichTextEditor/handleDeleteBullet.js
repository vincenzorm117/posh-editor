
/**
 * Handles the deletion of bullet points in a rich text editor when backspace is pressed.
 * 
 * This function specifically handles the case where the user presses backspace at the
 * beginning of the last (and only) list item in a list. When this occurs, it removes
 * the entire list element instead of just the list item, providing a better user experience.
 * 
 * @param {KeyboardEvent} event - The keyboard event triggered by user input
 * @returns {void}
 * 
 * @example
 * // Attach to a contenteditable element
 * element.addEventListener('keydown', handleDeleteBullet);
 * 
 * @description
 * The function performs the following checks before removing the list:
 * - Event key must be "Backspace"
 * - There must be a valid text selection
 * - Cursor must be at the start of a list item (startOffset and endOffset both 0)
 * - The current node must be an LI element
 * - The list must contain only one child element (the current list item)
 * 
 * If all conditions are met, it prevents the default backspace behavior and removes
 * the entire parent list element, allowing the browser to automatically handle cursor positioning.
 */
const handleDeleteBullet = (event) => {
  if (event.key !== "Backspace") return;

  // If nothing is selected, do nothing
  const selection = document.getSelection();
  if (!selection || !selection.rangeCount) return;
  // Get the range and start container
  const range = selection.getRangeAt(0);
  const node = range.startContainer;

  // Exit early if not backspacing at the start of the last list item in the list
  if(  range.startOffset != 0 
    || range.endOffset != 0 
    || node.nodeName !== "LI"
    || node.parentElement.childElementCount != 1) {
    return;
  }

  // Prevent default backspace behavior from deleting the list
  event.preventDefault();

  // Remove the entire list if it's the last item
  node.parentElement.remove();

  // No need to change the selection, browser automatically moves it to the right place
};

export default handleDeleteBullet;
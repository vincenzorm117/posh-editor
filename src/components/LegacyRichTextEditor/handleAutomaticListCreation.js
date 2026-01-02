/**
 * Handles automatic creation of ordered or unordered lists when typing bullet patterns.
 * Converts text starting with "* " to an unordered list or "1. " to an ordered list.
 * Only triggers when a space is typed after the bullet pattern and the text is not already in a list.
 *
 * @param {Event} event - The input event containing the typed character
 * @param {HTMLElement} rootParentNode - The root container element to prevent list conversion outside bounds
 * @returns {void} This function doesn't return a value
 *
 * @example
 * // HTML before typing:
 * // <div contenteditable="true">* </div>
 * //
 * // After typing a space, the HTML becomes:
 * // <div contenteditable="true"><ul><li></li></ul></div>
 *
 * const editor = document.querySelector('[contenteditable]');
 * editor.addEventListener('input', (event) => {
 *   handleAutomaticListCreation(event, editor);
 * });
 */
const handleAutomaticListCreation = (event, rootParentNode) => {
  const { nativeEvent } = event;
  // If not inserting a space, do nothing
  if (nativeEvent.inputType !== "insertText" || nativeEvent.data !== " ") {
    return;
  }
  // If nothing is selected, do nothing
  const selection = document.getSelection();
  if (!selection || !selection.rangeCount) return;
  // Get the range and start container
  const range = selection.getRangeAt(0);
  const node = range.startContainer;
  // Only process if we're in a text node
  if (node.nodeType !== Node.TEXT_NODE) return;

  // [Step] Perform checks to ensure we're in a text node and the text matches the bullet pattern
  // [Check] if the text content matches "* " or "1. "
  const matches = node.textContent.match(/^(\*|1\.)\s$/);
  const bulletType = matches?.[1] ?? null;
  // [Check] if the cursor is positioned right after "* " or "1. "
  if (range.startOffset < 2 || bulletType === null) {
    return;
  }

  // [Check] if the text is already in a list
  // Check if we're already inside a list element
  const closestList = node.parentElement.closest("ul, ol");
  if (closestList !== null && rootParentNode.contains(closestList)) {
    return;
  }

  // [Step] If we reach here, we need to convert the text to a list
  let parentNode = node.parentNode;
  if (bulletType === "*") {
    // Create the unordered list
    document.execCommand("insertUnorderedList", false, null);
  } else {
    // Create the unordered list
    document.execCommand("insertOrderedList", false, null);
  }

  // [Step] Clear the text after the bullet
  const list = parentNode.childNodes[0];
  const li = list.childNodes[0];
  li.innerHTML = "";

  // [Step] Position the cursor after the bullet
  range.setStart(li, 0);
  range.setEnd(li, 0);
  selection.removeAllRanges();
  selection.addRange(range);
};

export default handleAutomaticListCreation;

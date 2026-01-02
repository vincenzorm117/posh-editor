import closest from "./closest";

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

  // Only process if the selected node is within a list item
  if (!closest(node, "li")) return;

  if (nativeEvent.shiftKey) {
    // Outdent the list item
    document.execCommand("outdent", false, null);
  } else {
    // Indent the list item

    // Get parent ul
    const list = closest(node, "ul, ol");
    let listStyleType = null;
    if (list.nodeName === "UL") {
      listStyleType = list.classList.contains("!list-[circle]") ? "" : "!list-[circle]";
    } else if (list.nodeName === "OL") {
      // listStyleType = list.classList.contains("list-decimal") ? "list-decimal" : "list-decimal";
      listStyleType = "";
    }
    
    document.execCommand("indent", false, null);
    const newNode = document.getSelection().getRangeAt(0).startContainer;
    const newNodeList = closest(newNode, "ul, ol");
    if (listStyleType) newNodeList.classList.add(listStyleType);
  }
};

export default handleBulletShift;
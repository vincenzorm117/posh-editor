import { defaultFormatStates, tagToFormat, tagTypes } from "./constants";

/**
 * Analyzes the current text selection and returns an object indicating which formatting styles
 * are applied to the selected text. Checks for bold, italic, underline, strikethrough, hyperlinks,
 * and list formatting across all text nodes within the selection.
 *
 * @param {HTMLElement} rootParentNode - The root container element to limit the search within (e.g., the editor div)
 * @returns {Object} An object with boolean properties indicating which formats are present:
 *   - bold: boolean - True if selection contains bold text
 *   - italic: boolean - True if selection contains italic text
 *   - underline: boolean - True if selection contains underlined text
 *   - strikeThrough: boolean - True if selection contains strikethrough text
 *   - hyperlink: boolean - True if selection contains hyperlinked text
 *   - unorderedList: boolean - True if selection is within an unordered list
 *   - orderedList: boolean - True if selection is within an ordered list
 *
 * @example
 * // [HTML]
 *     <div id="editor">
 *       <p>Some <strong>bold</strong> and <em>italic</em> text</p>
 *     </div>
 * // User selects "bold and italic"
 *
 * // [JavaScript]
 * getSelectionFormatting(document.getElementById('editor'));
 * // Returns: {
 * //   bold: true,
 * //   italic: true,
 * //   underline: false,
 * //   strikeThrough: false,
 * //   hyperlink: false,
 * //   unorderedList: false,
 * //   orderedList: false
 * // }
 */
const getSelectionFormatting = (rootParentNode) => {
  // init result as empty Set
  const result = new Set();

  // [Step] Get the current selection
  const selection = window.getSelection();
  // [Step] If no selection, return empty Set
  if (!selection || !selection.rangeCount) return defaultFormatStates;

  // [Step] Get the range of the selection and the common ancestor
  const range = selection.getRangeAt(0);
  const root =
    range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;

  // [Step] Exit early if the root is not a child of the rootParentNode
  if (!rootParentNode.contains(root)) {
    return defaultFormatStates;
  }

  // [Step] Create a TreeWalker to traverse text nodes intersecting the range.
  // Text nodes will be leaf nodes, so we can use them to find the closest formatting elements.
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        return range.intersectsNode(node)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    },
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    // [Step] Text nodes don't support the contains method, so we start from the parent containing element. Note: Text nodes can't contain Text nodes.
    let currElement = node.parentElement;
    // [Step] Loop through the DOM tree until we are outside the rootParentNode
    while (rootParentNode.contains(currElement)) {
      // [Step] Check if the current element has a tag that maps to a format
      const tag = currElement.tagName.toUpperCase();
      const format = tagToFormat[tag];
      if (format) {
        result.add(format);
      }
      // [Step] Move up the DOM tree to the closest formatting element
      currElement = currElement.parentElement;
      currElement = currElement.closest(tagTypes);
    }
    // [Step] If we have found all formats, break
    if (result.size === 7) {
      break;
    }
  }

  // [Step] Convert Set to object with boolean values and return it
  return {
    bold: result.has("bold"),
    italic: result.has("italic"),
    underline: result.has("underline"),
    strikeThrough: result.has("strikeThrough"),
    hyperlink: result.has("hyperlink"),
    unorderedList: result.has("unorderedList"),
    orderedList: result.has("orderedList"),
  };
};

export default getSelectionFormatting;

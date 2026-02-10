import { clamp } from '@/helpers/clamp';
import createTextBrWalkerArray from '@/helpers/createTextBrWalkerArray';
import isTextNode from '@/helpers/isTextNode';

const virtualizeDomPoint = (
  root: HTMLElement,
  domNode: Node,
  domOffset: number,
): number => {
  if (!(root instanceof Node && domNode instanceof Node && 0 <= domOffset)) {
    throw new Error('Invalid DOM point parameters');
  }

  let cursor = 0;

  for (const block of Array.from(root.childNodes)) {
    // Get all text nodes and BR elements
    const nodes = createTextBrWalkerArray(block);

    // Search for location
    for (const currNode of nodes) {
      if (currNode == domNode) {
        if (isTextNode(currNode)) {
          // Note: clamp is optional safety here
          return (
            cursor + clamp(domOffset, 0, (currNode as Text).textContent.length)
          );
        }
        // Else, must be break element
        return cursor;
      }

      // TODO: Had "isBreakElement(currNode) cursor += 1; else the code below", should
      //        we revert back or keep this? I don't think we need the check anymroe
      //        since when the cursor moves from right of a to left of b in
      //        <p>a</p><p><br></p><p>b</p> it only moves 2 cursor positions, not 3.
      // TODO: Need to know whether to use textContent or nodeValue
      cursor += (currNode as Text).textContent.length;
    }

    // Add one to account for newlines between blocks
    cursor += 1;
  }

  return cursor;
};

export default virtualizeDomPoint;

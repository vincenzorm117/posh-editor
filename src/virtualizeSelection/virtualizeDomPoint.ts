import { clamp } from '@/helpers/clamp';
import createWalkerArray from '@/helpers/createWalkerArray';
import isBreakElement from '@/helpers/isBreakElement';

const virtualizeDomPoint = (
  root: HTMLElement,
  node: Node,
  offset: number,
): number => {
  if (!(root instanceof Node && node instanceof Node && 0 <= offset)) {
    throw new Error('Invalid DOM point parameters');
  }

  let globalStart = 0;

  for (const block of Array.from(root.childNodes)) {
    // Get all text nodes and BR elements
    const nodes = createWalkerArray(
      block,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      (n) => {
        if (n.nodeType == Node.TEXT_NODE || isBreakElement(n))
          return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      },
    );

    // Search for location
    for (const currNode of nodes) {
      if (currNode == node) {
        if (currNode.nodeType == Node.TEXT_NODE) {
          return (
            globalStart +
            clamp(offset, 0, (currNode as Text).textContent.length)
          );
        }
        // Else, must be break element
        return globalStart;
      }

      if (isBreakElement(currNode)) {
        globalStart += 1;
      } else {
        globalStart += (currNode as Text).textContent.length;
      }
    }

    // Add one to account for newlines between blocks
    globalStart += 1;
  }

  return globalStart;
};

export default virtualizeDomPoint;

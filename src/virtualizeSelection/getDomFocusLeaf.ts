import isBreakElement from '@/helpers/isBreakElement';
import getDomLastLeaf from './getDomLastLeaf';
import getDomPrevLeaf from './getDomPrevLeaf';
import getDomFirstLeaf from './getDomFirstLeaf';
import isTextNode from '@/helpers/isTextNode';
import isElementNode from '@/helpers/isElementNode';

const getDomFocusLeaf = (
  root: HTMLElement,
  node: Node | null,
  offset: number,
): [Node, number] => {
  if (!(node instanceof Node && 0 <= offset)) {
    throw new Error('Invalid selection: focusNode or focusOffset is invalid');
  }

  // Case: Text node
  if (isTextNode(node)) {
    return [node, offset];
  }

  // Case: Break element
  if (isBreakElement(node)) {
    return [node, 0];
  }

  // Case: Invalid node type
  if (!isElementNode(node)) {
    throw new Error(
      'Invalid selection: focusNode must be a text or element node',
    );
  }

  // Case: Element node - check children at offset
  if (0 < offset && offset <= node.childNodes.length) {
    const child = node.childNodes[offset - 1];

    // Subcase: Get last leaf of child at offset - 1
    const childsLeaf = getDomLastLeaf(child);
    if (childsLeaf) {
      if (isBreakElement(childsLeaf)) return [childsLeaf, 0];
      return [childsLeaf, (childsLeaf as Text).textContent.length];
    }

    // Subcase: Childsleaf does not exist, get previous leaf in DOM
    const prevNode = getDomPrevLeaf(root, child);
    if (prevNode) {
      if (isBreakElement(prevNode)) return [prevNode, 0];
      return [prevNode, (prevNode as Text).textContent.length];
    }
  }
  // Case: offset at beginning of childNodes
  else if (offset <= 0) {
    const prev = getDomPrevLeaf(root, node);
    if (prev) {
      if (isBreakElement(prev)) return [prev, 0];
      else return [prev, (prev as Text).textContent.length];
    }
  }
  // Case: offset at end of childNodes
  else if (node.childNodes.length < offset) {
    const lastLeaf = getDomLastLeaf(node);
    if (lastLeaf) {
      if (isBreakElement(lastLeaf)) return [lastLeaf, 0];
      return [lastLeaf, (lastLeaf as Text).textContent.length];
    }
  }
  // Fallback: return first leaf in root if available
  const fallback = getDomFirstLeaf(root);
  if (fallback) {
    if (isBreakElement(fallback)) return [fallback, 0];
    return [fallback, 0];
  }
  // Fallback: return root at offset 0
  return [root, 0];
};

export default getDomFocusLeaf;

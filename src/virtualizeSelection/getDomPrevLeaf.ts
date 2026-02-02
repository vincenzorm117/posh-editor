import isBreakElement from '@/helpers/isBreakElement';
import isTextNode from '@/helpers/isTextNode';
import getDomPrevNode from './getDomPrevNode';

const getDomPrevLeaf = (root: HTMLElement, node: Node) => {
  let prev;
  do {
    prev = getDomPrevNode(root, node);
    if (isBreakElement(prev)) return prev;
    if (isTextNode(prev)) return prev;
  } while (prev != null);
  return null;
};

export default getDomPrevLeaf;

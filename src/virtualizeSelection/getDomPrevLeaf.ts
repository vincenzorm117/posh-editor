import isBreakElement from '@/helpers/isBreakElement';
import isTextNode from '@/helpers/isTextNode';
import getDomPrevNode from './getDomPrevNode';

const getDomPrevLeaf = (root: HTMLElement, node: Node) => {
  let prev = node as Node | null;
  while (prev != null && prev !== root) {
    prev = getDomPrevNode(root, prev as Node);
    if (isBreakElement(prev)) return prev;
    if (isTextNode(prev)) return prev;
  }
  return null;
};

export default getDomPrevLeaf;

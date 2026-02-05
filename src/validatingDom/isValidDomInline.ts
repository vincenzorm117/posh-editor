import isTextNode from '@/helpers/isTextNode';
import { VALID_INLINE_NODES } from '../constants';
import isElementNode from '@/helpers/isElementNode';
import isBreakElement from '@/helpers/isBreakElement';

const isValidDomInline = (node: Node) => {
  if (isTextNode(node)) return true;

  if (!isElementNode(node)) return false;

  if (isBreakElement(node)) return node.childNodes.length == 0;

  if (!(VALID_INLINE_NODES as string[]).includes(node.nodeName)) {
    return false;
  }

  return Array.from(node.childNodes).every(isValidDomInline);
};

export default isValidDomInline;

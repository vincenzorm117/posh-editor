import isTextNode from '@/helpers/isTextNode';
import { VALID_INLINE_NODES } from '../constants';

const isValidDomInline = (node: Node) => {
  if (isTextNode(node)) return true;

  if (node.nodeType != Node.ELEMENT_NODE) return false;

  if (node.nodeName == 'BR') return node.childNodes.length == 0;

  if (!(VALID_INLINE_NODES as string[]).includes(node.nodeName)) {
    return false;
  }

  return Array.from(node.childNodes).every(isValidDomInline);
};

export default isValidDomInline;

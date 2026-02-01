import { VALID_BLOCK_NODES } from '../constants';
import isValidDomInline from './isValidDomInline';

const isValidDomBlock = (node: Node) => {
  if (node.nodeType == Node.TEXT_NODE) return true;

  if (node.nodeType != Node.ELEMENT_NODE) return false;

  if (node.nodeName == 'BR') return node.childNodes.length == 0;

  if (!(VALID_BLOCK_NODES as string[]).includes(node.nodeName)) {
    return false;
  }

  return Array.from(node.childNodes).every(isValidDomInline);
};

export default isValidDomBlock;

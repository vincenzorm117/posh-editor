import isTextNode from '@/helpers/isTextNode';
import { VALID_BLOCK_NODES } from '../constants';
import isValidDomInline from './isValidDomInline';
import isElementNode from '@/helpers/isElementNode';
import isBreakElement from '@/helpers/isBreakElement';

const isValidDomBlock = (node: Node) => {
  if (isTextNode(node)) return true;

  if (!isElementNode(node)) return false;

  if (isBreakElement(node)) return node.childNodes.length == 0;

  if (!(VALID_BLOCK_NODES as string[]).includes(node.nodeName)) {
    return false;
  }

  return Array.from(node.childNodes).every(isValidDomInline);
};

export default isValidDomBlock;

import isElementNode from '@/helpers/isElementNode';
import isValidDomBlock from './isValidDomBlock';

const isValidDomDocument = (node: HTMLElement): boolean => {
  // Must be <div contenteditable=true>
  if (
    !isElementNode(node) ||
    node.nodeName !== 'DIV' ||
    node.getAttribute('contenteditable') !== 'true'
  ) {
    return false;
  }

  return Array.from(node.childNodes).every((n) => isValidDomBlock(n));
};

export default isValidDomDocument;

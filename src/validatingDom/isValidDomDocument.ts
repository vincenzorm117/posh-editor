import isValidDomBlock from './isValidDomBlock';

const isValidDomDocument = (node: HTMLElement): boolean => {
  // Must be <div contenteditable=true>
  if (
    node.nodeType !== Node.ELEMENT_NODE ||
    node.nodeName !== 'div' ||
    node.getAttribute('contenteditable') !== 'true'
  ) {
    return false;
  }

  return Array.from(node.childNodes).every((n) => isValidDomBlock(n));
};

export default isValidDomDocument;

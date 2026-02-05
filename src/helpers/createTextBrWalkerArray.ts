import createWalkerArray from './createWalkerArray';
import isBreakElement from './isBreakElement';
import isTextNode from './isTextNode';

const createTextBrWalkerArray = (node: Node): Node[] => {
  return createWalkerArray(
    node,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    (node: Node) => {
      // Accept text nodes and BR elements
      return isTextNode(node) || isBreakElement(node)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  );
};

export default createTextBrWalkerArray;

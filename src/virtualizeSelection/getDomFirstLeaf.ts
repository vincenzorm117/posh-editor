import createWalkerArray from '@/helpers/createWalkerArray';
import isBreakElement from '@/helpers/isBreakElement';

const getDomFirstLeaf = (node: Node) => {
  const nodes = createWalkerArray(
    node,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    (node: Node) => {
      if (node.nodeType == Node.TEXT_NODE || isBreakElement(node))
        return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    },
  );

  return nodes[0];
};

export default getDomFirstLeaf;

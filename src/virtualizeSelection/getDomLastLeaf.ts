import createWalkerArray from '@/helpers/createWalkerArray';
import isBreakElement from '@/helpers/isBreakElement';

const getDomLastLeaf = (node: Node) => {
  const nodes = createWalkerArray(
    node,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    (node: Node) => {
      if (node.nodeType == Node.TEXT_NODE || isBreakElement(node))
        return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    },
  );

  return nodes[nodes.length - 1];
};

export default getDomLastLeaf;

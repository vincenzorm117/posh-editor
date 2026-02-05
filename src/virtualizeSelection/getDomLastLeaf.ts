import createTextBrWalkerArray from '@/helpers/createTextBrWalkerArray';

const getDomLastLeaf = (node: Node) => {
  const nodes = createTextBrWalkerArray(node);
  return nodes[nodes.length - 1];
};

export default getDomLastLeaf;

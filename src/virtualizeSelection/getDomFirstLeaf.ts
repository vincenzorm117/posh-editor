import createTextBrWalkerArray from '@/helpers/createTextBrWalkerArray';

const getDomFirstLeaf = (node: Node) => {
  const nodes = createTextBrWalkerArray(node);
  return nodes[0];
};

export default getDomFirstLeaf;

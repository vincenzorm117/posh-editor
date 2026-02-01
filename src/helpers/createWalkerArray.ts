const createWalkerArray = (
  node: Node,
  whatToShow: number,
  acceptFn: (node: Node) => number,
): Node[] => {
  const walker = document.createTreeWalker(node, whatToShow, {
    acceptNode: acceptFn,
  });

  const nodes: Node[] = [];
  let currentNode: Node | null;
  while ((currentNode = walker.nextNode())) {
    nodes.push(currentNode);
  }

  return nodes;
};

export default createWalkerArray;

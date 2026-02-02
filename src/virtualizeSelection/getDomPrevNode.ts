const getDomPrevNode = (root: HTMLElement, node: Node) => {
  if (!node) return null;
  if (node === root) return null;
  if (node.previousSibling) {
    node = node.previousSibling;
    while (node && node.lastChild) node = node.lastChild;
    return node;
  }
  return node.parentNode;
};

export default getDomPrevNode;

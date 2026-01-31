const domCreateNode = (node: VirtualTreeNode): Node => {
  // If text node, create text node
  if (node.type == 'text') return document.createTextNode(node.text);
  // Else, element node
  const element = document.createElement(node.tag!);
  // Set HTML attributes
  for (const [key, value] of Object.entries(node.props!)) {
    element.setAttribute(key, String(value));
  }
  // Recursively create and append child nodes
  const children = node?.children ?? [];
  for (const child of children) {
    element.appendChild(domCreateNode(child));
  }
  // Return created element
  return element;
};

export default domCreateNode;

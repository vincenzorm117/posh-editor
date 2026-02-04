const createDomNode = (node: VirtualTreeNode): Node => {
  if (node.type == 'text') {
    return document.createTextNode(node.text);
  }

  const element = document.createElement(node.tag);
  for (const [key, value] of Object.entries(node.props)) {
    element.setAttribute(key, value);
  }

  for (const childNode of node.children) {
    element.appendChild(createDomNode(childNode));
  }

  return element;
};

export default createDomNode;

const isBreakElement = (node: Node | null | undefined) => {
  return node?.nodeType == Node.ELEMENT_NODE && node?.nodeName == 'BR';
};

export default isBreakElement;

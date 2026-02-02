const isElementNode = (node: Node | null | undefined): boolean => {
  return node?.nodeType === Node.ELEMENT_NODE;
};

export default isElementNode;

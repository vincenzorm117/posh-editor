const isTextNode = (node: Node | null | undefined): boolean => {
  return node?.nodeType === Node.TEXT_NODE;
};

export default isTextNode;

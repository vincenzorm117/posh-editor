const areVirtualTreeNodesDifferent = (
  A: VirtualTreeNode,
  B: VirtualTreeNode,
): boolean => {
  return (
    // Return true if types are different
    A.type != B.type ||
    // Or tag is different for elements
    (A.type == 'element' && A.tag != (B as VirtualTreeElement).tag)
  );
};

export default areVirtualTreeNodesDifferent;

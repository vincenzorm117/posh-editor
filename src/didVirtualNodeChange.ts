const didVirtualNodeChange = (
  oldNode: VirtualTreeNode,
  newNode: VirtualTreeNode,
) => {
  return (
    oldNode.type !== newNode.type ||
    (oldNode.type == 'element' &&
      (oldNode.tag !== (newNode as VirtualTreeElement).tag! ||
        oldNode.key !== (newNode as VirtualTreeElement).key!))
  );
};

export default didVirtualNodeChange;

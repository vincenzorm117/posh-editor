import createVirtualTreeNode from './createVirtualTreeNode';

const createVirtualTree = (
  vDoc: VirtualDocument,
  actions: Record<string, VirtualAction>,
): VirtualTree => {
  return {
    type: 'root',
    tag: 'DIV',
    id: vDoc.id,
    props: {},
    children: vDoc.blocks.map((block) => {
      return {
        type: 'element',
        tag: block.tag,
        id: block.id,
        props: {},
        children: block.inlines.map((b) => createVirtualTreeNode(b, actions)),
      };
    }),
  };
};

export default createVirtualTree;

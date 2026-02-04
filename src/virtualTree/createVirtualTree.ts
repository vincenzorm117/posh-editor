import createVirtualTreeNode from './createVirtualTreeNode';

const createVirtualTree = (vDoc: VirtualDocument): VirtualTree => {
  return {
    type: 'root',
    tag: 'div',
    props: {},
    children: vDoc.blocks.map((block) => {
      return {
        type: 'element',
        tag: block.tag,
        props: {},
        children: block.inlines.map(createVirtualTreeNode),
      };
    }),
  };
};

export default createVirtualTree;

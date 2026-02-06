const render = (child: VirtualTreeNode): VirtualTreeNode => {
  return {
    type: 'element',
    tag: 'B',
    props: {},
    children: [child],
  };
};

export default render;

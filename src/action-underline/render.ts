const render = (child: VirtualTreeNode): VirtualTreeNode => {
  return {
    type: 'element',
    tag: 'SPAN',
    props: { class: 'underline' },
    children: [child],
  };
};

export default render;

const render = (child: VirtualTreeNode): VirtualTreeNode => {
  return {
    type: 'element',
    tag: 'SPAN',
    props: { class: 'font-bold' },
    children: [child],
  };
};

export default render;

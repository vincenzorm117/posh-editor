const createVirtualBlock = (
  tag: VirtualBlockTag,
  inlines: VirtualInline[],
): VirtualBlock => {
  return {
    type: 'block',
    tag,
    inlines,
  };
};

export default createVirtualBlock;

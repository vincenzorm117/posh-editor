import generateId from '@/helpers/generateId';

const createVirtualBlock = (
  tag: VirtualBlockTag,
  inlines: VirtualInline[],
): VirtualBlock => {
  return {
    id: generateId(),
    type: 'block',
    tag,
    inlines,
  };
};

export default createVirtualBlock;

import generateId from '@/helpers/generateId';

const createVirtualDocument = (blocks: VirtualBlock[]): VirtualDocument => {
  return {
    id: generateId(),
    type: 'doc',
    blocks,
  };
};

export default createVirtualDocument;

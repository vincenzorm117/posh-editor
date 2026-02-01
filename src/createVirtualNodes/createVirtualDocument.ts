const createVirtualDocument = (blocks: VirtualBlock[]): VirtualDocument => {
  return {
    type: 'doc',
    blocks,
  };
};

export default createVirtualDocument;

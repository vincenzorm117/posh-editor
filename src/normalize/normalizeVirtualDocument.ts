import normalizeVirtualBlock from './normalizeVirtualBlock';

const normalizeVirtualDocument = (
  oldVDoc: VirtualDocument,
): VirtualDocument => {
  return {
    type: 'doc',
    blocks: oldVDoc.blocks.map((b) => normalizeVirtualBlock(b)),
  };
};

export default normalizeVirtualDocument;

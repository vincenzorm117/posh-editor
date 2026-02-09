const getBlockInlineIndecesAtPosition = (
  vIndex: VirtualDocumentIndex,
  position: number,
) => {
  for (const blockIndex of vIndex.blocks) {
    if (blockIndex.start <= position && position <= blockIndex.end) {
      for (const inlineIndex of blockIndex.inlines) {
        if (inlineIndex.start <= position && position <= inlineIndex.end) {
          return { blockIndex, inlineIndex };
        }
      }
    }
  }
  throw new Error('No block/inline found at position');
};

export default getBlockInlineIndecesAtPosition;

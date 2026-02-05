import getBlockLength from '@/utils/getBlockLength';

const createVirtualDocumentIndex = (
  vDoc: VirtualDocument,
): VirtualDocumentIndex => {
  let cursor = 0;

  const blocks = vDoc.blocks.map((block, blockIndex) => {
    // Calculate block length
    const length = getBlockLength(block);
    // Create block index
    const vBlockIndex = {
      blockIndex,
      start: cursor,
      end: cursor + length,
      length,
      inlines: [] as VirtualInlineIndex[],
    };
    // Create inline indexes
    vBlockIndex.inlines = block.inlines.map((inline, inlineIndex) => {
      const vInlineIndex = {
        blockIndex,
        inlineIndex,
        start: cursor,
        end: cursor + inline.text.length,
        length: inline.text.length,
      };
      // Advance cursor
      cursor += inline.text.length;
      // Return inline index
      return vInlineIndex as VirtualInlineIndex;
    });

    // For the block separator (e.g., newline)
    cursor += 1;

    return vBlockIndex;
  });

  return {
    blocks,
    length: cursor,
  };
};

export default createVirtualDocumentIndex;

import getBlockLength from '@/utils/getBlockLength';

const createVirtualDocumentIndex = (
  vDoc: VirtualDocument,
): VirtualDocumentIndex => {
  let globalStart = 0;

  const blocks = vDoc.blocks.map((block, blockIndex) => {
    // Calculate block length
    const length = getBlockLength(block);
    // Create block index
    const vBlockIndex = {
      blockIndex,
      start: globalStart,
      end: globalStart + length - 1,
      length,
      inlines: [] as VirtualInlineIndex[],
    };
    // Create inline indexes
    vBlockIndex.inlines = block.inlines.map((inline, inlineIndex) => {
      const vInlineIndex = {
        blockIndex,
        inlineIndex,
        start: globalStart,
        end: globalStart + inline.text.length - 1,
        length: inline.text.length,
      };

      globalStart += inline.text.length;

      return vInlineIndex as VirtualInlineIndex;
    });

    // For the block separator (e.g., newline)
    globalStart += 1;

    return vBlockIndex;
  });

  return {
    blocks,
    length: globalStart,
  };
};

export default createVirtualDocumentIndex;

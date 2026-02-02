const createVirtualDocumentIndex = (
  vDoc: VirtualDocument,
): VirtualDocumentIndex => {
  let globalStart = 0;

  const blocks = vDoc.blocks.map((block, blockIndex) => {
    let blockStart = 0;

    const vBlockIndex = {
      blockIndex,
      globalStart,
      inlines: [] as VirtualInlineIndex[],
      length: 0,
    };

    vBlockIndex.inlines = block.inlines.map((inline, inlineIndex) => {
      const vInlineIndex = {
        blockIndex,
        inlineIndex,
        globalStart,
        blockStart,
        length: inline.text.length,
      };

      blockStart += inline.text.length;
      globalStart += inline.text.length;

      return vInlineIndex as VirtualInlineIndex;
    });

    vBlockIndex.length = blockStart;
    return vBlockIndex;
  });

  return {
    blocks,
    length: globalStart,
  };
};

export default createVirtualDocumentIndex;

const trimDocWhiteSpace = (blocks: VirtualBlock[]): VirtualBlock[] => {
  if (blocks.length <= 0) {
    return blocks;
  }

  // Trim leading whitespace from the first block
  const firstBlock = blocks[0];
  if (firstBlock.inlines.length > 0) {
    firstBlock.inlines[0].text = firstBlock.inlines[0].text.trimStart();
  }

  // Trim trailing whitespace from the last block
  const lastBlock = blocks[blocks.length - 1];
  if (lastBlock.inlines.length > 0) {
    const lastInline = lastBlock.inlines[lastBlock.inlines.length - 1];
    lastInline.text = lastInline.text.trimEnd();
  }

  return blocks;
};

export default trimDocWhiteSpace;

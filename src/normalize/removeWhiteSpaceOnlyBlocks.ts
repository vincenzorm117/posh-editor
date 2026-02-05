const removeWhiteSpaceOnlyBlocks = (blocks: VirtualBlock[]): VirtualBlock[] => {
  return blocks.filter((block) => {
    if (block.inlines.length === 0) {
      return false;
    }

    const nonWhiteSpaceLength = block.inlines.reduce((acc, inline) => {
      return acc + inline.text.trim().length;
    }, 0);

    return nonWhiteSpaceLength > 0;
  });
};

export default removeWhiteSpaceOnlyBlocks;

const shrinkConsecutiveSpaces = (blocks: VirtualBlock[]): VirtualBlock[] => {
  for (const block of blocks) {
    for (const inline of block.inlines) {
      inline.text = inline.text.replace(/ {2,}/g, ' ');
    }
  }

  return blocks;
};

export default shrinkConsecutiveSpaces;

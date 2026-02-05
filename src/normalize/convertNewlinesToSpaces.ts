const convertNewlinesToSpaces = (blocks: VirtualBlock[]): VirtualBlock[] => {
  for (const block of blocks) {
    for (const inline of block.inlines) {
      inline.text = inline.text.replace(/\n/g, ' ');
    }
  }

  return blocks;
};

export default convertNewlinesToSpaces;

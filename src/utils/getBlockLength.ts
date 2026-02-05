const getBlockLength = (block: VirtualBlock): number => {
  return block.inlines.reduce((acc, inline) => acc + inline.text.length, 0);
};
export default getBlockLength;

const getIntersectingInlines = (
  vSel: { start: number; end: number },
  blocks: Array<[number, VirtualBlock]>,
  vIndex: VirtualDocumentIndex,
): VirtualInline[] => {
  return blocks
    .map(([index, block]) => {
      const virtualBlockIndex = vIndex.blocks[index];

      return block.inlines.filter((_, i) => {
        const { globalStart, length } = virtualBlockIndex.inlines[i];

        const inlineStart = globalStart;
        const inlineEnd = globalStart + length;

        return vSel.start <= inlineEnd && inlineStart <= vSel.end;
      });
    })
    .flat();
};

export default getIntersectingInlines;

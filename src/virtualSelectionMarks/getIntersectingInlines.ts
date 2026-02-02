const getIntersectingInlines = (
  vSel: { start: number; end: number },
  blocks: Array<[number, VirtualBlock]>,
  vIndex: VirtualDocumentIndex,
): VirtualInline[] => {
  return blocks
    .map(([index, block]) => {
      const virtualBlockIndex = vIndex.blocks[index];

      return block.inlines.filter((inline, i) => {
        const { globalStart, length } = virtualBlockIndex.inlines[i];

        if (globalStart + length < vSel.start) {
          return false;
        }

        if (vSel.end < globalStart) {
          return false;
        }

        return true;
      });
    })
    .flat();
};

export default getIntersectingInlines;

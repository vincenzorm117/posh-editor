const getIntersectingInlines = (
  vSel: { start: number; end: number },
  blocks: Array<[number, VirtualBlock]>,
  vIndex: VirtualDocumentIndex,
): VirtualInline[] => {
  return blocks
    .map(([index, block]) => {
      const virtualBlockIndex = vIndex.blocks[index];

      return block.inlines.filter((_, i) => {
        const inline = virtualBlockIndex.inlines[i];

        // TODO: maybe change < to <= ?
        return vSel.start <= inline.end && inline.start <= vSel.end;
      });
    })
    .flat();
};

export default getIntersectingInlines;

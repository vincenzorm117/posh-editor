import overlap from '@/helpers/overlap';

const getIntersectingInlines = (
  vSel: { start: number; end: number; isCollapsed: boolean },
  vDoc: VirtualDocument,
  vIndex: VirtualDocumentIndex,
): VirtualInline[] => {
  return (
    vDoc.blocks
      // Convert block to [blockIndex, block]
      .map((b, i) => {
        return [i, b] as [number, VirtualBlock];
      })
      // Filter out blocks that dont intersect with selection
      .filter((_, i) => {
        const { start, end } = vIndex.blocks[i];

        return vSel.isCollapsed
          ? start < vSel.start && vSel.start <= end
          : overlap(vSel, vIndex.blocks[i]) > 0;
      })
      // For each intersecting block, get the intersecting inlines
      .map(([index, block]) => {
        const virtualBlockIndex = vIndex.blocks[index];

        // Filter inlines that intersect with selection
        return block.inlines.filter((_, i) => {
          const { start, end } = virtualBlockIndex.inlines[i];

          return vSel.isCollapsed
            ? start < vSel.start && vSel.start <= end
            : overlap(vSel, virtualBlockIndex.inlines[i]) > 0;
        });
      })
      .flat()
  );
};

export default getIntersectingInlines;

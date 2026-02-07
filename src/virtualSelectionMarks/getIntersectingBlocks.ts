import overlap from '@/helpers/overlap';

const getIntersectingBlocks = (
  vSel: { start: number; end: number; isCollapsed: boolean },
  vDoc: VirtualDocument,
  vIndex: VirtualDocumentIndex,
): Array<[number, VirtualBlock]> => {
  return (
    vDoc.blocks
      // Convert block to [blockIndex, block]
      .map((b, i) => {
        return [i, b] as [number, VirtualBlock];
      })
      .filter((_, i) => {
        const { start, end } = vIndex.blocks[i];

        return vSel.isCollapsed
          ? start < vSel.start && vSel.start <= end
          : overlap(vSel, vIndex.blocks[i]) > 0;
      })
  );
};

export default getIntersectingBlocks;

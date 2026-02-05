import overlap from '@/helpers/overlap';

const getIntersectingBlocks = (
  vSel: { start: number; end: number },
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
        return overlap(vSel, vIndex.blocks[i]) > 0;
      })
  );
};

export default getIntersectingBlocks;

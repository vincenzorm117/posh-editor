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
        const { globalStart, length } = vIndex.blocks[i];

        if (globalStart + length < vSel.start) {
          return false;
        }

        if (vSel.end < globalStart) {
          return false;
        }

        return true;
      })
  );
};

export default getIntersectingBlocks;

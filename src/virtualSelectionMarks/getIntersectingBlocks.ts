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

        const blockStart = globalStart;
        const blockEnd = globalStart + length;

        return vSel.start <= blockEnd && blockStart <= vSel.end;
      })
  );
};

export default getIntersectingBlocks;

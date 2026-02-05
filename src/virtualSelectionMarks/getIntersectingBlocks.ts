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
        const block = vIndex.blocks[i];

        // TODO: maybe change < to <= ?
        return vSel.start <= block.end && block.start <= vSel.end;
      })
  );
};

export default getIntersectingBlocks;

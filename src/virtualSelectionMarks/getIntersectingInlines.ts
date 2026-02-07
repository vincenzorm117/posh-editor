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

        // If selection is collapsed to caret, then return true if caret is within the block.
        if (vSel.isCollapsed) {
          return start <= vSel.start && vSel.start <= end;
        }
        // Else return true if there is any overlap between selection and block
        return overlap(vSel, vIndex.blocks[i]) > 0;
      })
      // For each intersecting block, get the intersecting inlines
      .map(([index, block]) => {
        const virtualBlockIndex = vIndex.blocks[index];

        // Filter inlines that intersect with selection
        return block.inlines.filter((_, i) => {
          const { start, end } = virtualBlockIndex.inlines[i];

          // If the selection is collapsed
          if (vSel.isCollapsed) {
            // Check if inline is the first inline of the block. If so, we include it if the caret is at the start of the block (edge case for caret at start of block that is also start of inline)
            if (start == virtualBlockIndex.start) {
              return start <= vSel.start && vSel.start <= end;
            }
            // Otherwise, we check if the caret is within the inline
            return start < vSel.start && vSel.start <= end;
          }

          // If the selection is not collapsed, we check if there is any overlap between the selection and the inline
          return overlap(vSel, virtualBlockIndex.inlines[i]) > 0;
        });
      })
      .flat()
  );
};

export default getIntersectingInlines;

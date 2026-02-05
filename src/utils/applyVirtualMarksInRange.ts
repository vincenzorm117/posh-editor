import createVirtualDocumentIndex from '@/virtualIndex/createVirtualDocumentIndex';
import getVirtuallySelectedBlocksAndInlines from './getVirtuallySelectedBlocksAndInlines';
import normalizeVirtualDocument from '@/normalize/normalizeVirtualDocument';

const applyVirtualMarksInRange = (
  vState: VirtualState,
  marksToApply: VirtualMarks,
) => {
  const vSel = vState.vSel as VirtualSelectionInEditor;

  // Set so start comes before end

  const selStart = Math.min(vSel.start, vSel.end);
  const selEnd = Math.max(vSel.start, vSel.end);

  const { blocks, blockIndeces } = getVirtuallySelectedBlocksAndInlines(vState);

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockIndex = blockIndeces[i];

    const newInlines = [] as VirtualInline[];

    for (let j = 0; j < block.inlines.length; j++) {
      const inline = block.inlines[j];
      const inlineStart = blockIndex.inlines[j].start;
      const inlineEnd = blockIndex.inlines[j].end;

      // Skip if inline doesn't intersect selection
      if (selEnd < inlineStart || inlineEnd < selStart) {
        newInlines.push(inline);
        continue;
      }

      const cutStart = Math.max(selStart - inlineStart, 0);
      const cutEnd = Math.min(selEnd - inlineStart, inlineEnd);

      // Add pre-selection part without marks
      if (inlineStart < selStart) {
        newInlines.push({
          ...inline,
          text: inline.text.slice(0, cutStart),
        });
      }

      // Add selected part with marks applied
      newInlines.push({
        ...inline,
        text: inline.text.slice(cutStart, cutEnd),
        marks: {
          ...(inline?.marks ?? {}),
          ...marksToApply,
        },
      });

      // Add post-selection part without marks
      if (selEnd < inlineEnd) {
        newInlines.push({
          ...inline,
          text: inline.text.slice(cutEnd),
        });
      }
    }

    block.inlines = newInlines;
  }

  vState.vDoc = normalizeVirtualDocument(vState.vDoc);
  vState.vIndex = createVirtualDocumentIndex(vState.vDoc);
};

export default applyVirtualMarksInRange;

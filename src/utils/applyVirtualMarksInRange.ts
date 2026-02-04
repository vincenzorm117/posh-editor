import createVirtualDocumentIndex from '@/virtualIndex/createVirtualDocumentIndex';
import getVirtuallySelectedBlocksAndInlines from './getVirtuallySelectedBlocksAndInlines';
import normalizeVirtualDocument from '@/normalize/normalizeVirtualDocument';

const applyVirtualMarksInRange = (
  vState: VirtualState,
  marksToApply: VirtualMarks,
) => {
  const vSel = vState.vSel as VirtualSelectionInEditor;

  // Set so start comes before end
  const start = Math.min(vSel.start, vSel.end);
  const end = Math.max(vSel.start, vSel.end);

  const { blocks, blockIndeces } = getVirtuallySelectedBlocksAndInlines(vState);

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockIndex = blockIndeces[i];

    const newInlines = [] as VirtualInline[];

    for (let j = 0; j < block.inlines.length; j++) {
      const inline = block.inlines[j];
      const { globalStart, length } = blockIndex.inlines[j];

      // Skip if inline doesn't intersect selection
      if (end < globalStart || globalStart + length <= start) {
        newInlines.push(inline);
        continue;
      }

      const cutStart = start - globalStart;
      const cutEnd = Math.min(end - globalStart, globalStart + length);

      if (globalStart <= start) {
        newInlines.push({
          ...inline,
          text: inline.text.slice(0, cutStart),
        });
      }

      newInlines.push({
        ...inline,
        text: inline.text.slice(cutStart, cutEnd),
        marks: {
          ...(inline?.marks ?? {}),
          ...marksToApply,
        },
      });

      if (end < globalStart + length) {
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

import getIntersectingBlocks from './getIntersectingBlocks';
import getIntersectingInlines from './getIntersectingInlines';

const getVirtualSelectionMarks = (
  vSel: { start: number; end: number },
  vDoc: VirtualDocument,
  vIndex: VirtualDocumentIndex,
): VirtualSelectionMarks => {
  const indexedBlocks = getIntersectingBlocks(vSel, vDoc, vIndex);
  const inlines = getIntersectingInlines(vSel, indexedBlocks, vIndex);

  const marks: VirtualSelectionMarks = {};

  for (const inline of inlines) {
    for (const [key, markIsOn] of Object.entries(
      inline.marks,
    ) as VirtualMarkEntries) {
      if (!marks.hasOwnProperty(key)) {
        marks[key] = VirtualSelectionMarkValue.OFF;
      }
      const markValue = markIsOn
        ? VirtualSelectionMarkValue.ON
        : VirtualSelectionMarkValue.OFF;
      marks[key] = marks[key]! | markValue;
    }
  }

  return marks;
};

export default getVirtualSelectionMarks;

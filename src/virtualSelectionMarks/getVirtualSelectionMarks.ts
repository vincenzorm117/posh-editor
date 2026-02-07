import { VirtualSelectionMarkValue } from '@/constants';
import getIntersectingInlines from './getIntersectingInlines';

const getVirtualSelectionMarks = (
  vSel: { start: number; end: number; isCollapsed: boolean },
  vDoc: VirtualDocument,
  vIndex: VirtualDocumentIndex,
  actions: Record<string, VirtualAction>,
): VirtualSelectionMarks => {
  // Get intersecting blocks and inlines
  const inlines = getIntersectingInlines(vSel, vDoc, vIndex);

  // Initialize marks with empty object
  const marks = {} as VirtualSelectionMarks;

  for (const markKey in actions) {
    // Initialize the mark value to NONE for each mark type
    marks[markKey] = VirtualSelectionMarkValue.NONE;

    for (const inline of inlines) {
      // Only if the mark is present in the inline and is set to true, we consider it ON. Otherwise, it is OFF.
      const markValue =
        inline.marks[markKey] === true
          ? VirtualSelectionMarkValue.ON
          : VirtualSelectionMarkValue.OFF;
      // Update the mark value using bitwise OR to combine multiple inlines' marks
      marks[markKey] = marks[markKey]! | markValue;
    }
  }

  return marks;
};

export default getVirtualSelectionMarks;

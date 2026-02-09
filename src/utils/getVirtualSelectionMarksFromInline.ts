import { VirtualSelectionMarkValue } from '@/constants';

const getVirtualSelectionMarksFromInline = (
  inline: VirtualInline,
): VirtualSelectionMarks => {
  const marks = {} as VirtualSelectionMarks;
  for (const markKey in inline.marks) {
    // Only if the mark is present in the inline and is set to true, we consider it ON. Otherwise, it is OFF.
    marks[markKey] =
      inline.marks[markKey] === true
        ? VirtualSelectionMarkValue.ON
        : VirtualSelectionMarkValue.OFF;
  }
  return marks;
};

export default getVirtualSelectionMarksFromInline;

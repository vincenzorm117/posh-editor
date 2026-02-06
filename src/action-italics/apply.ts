import { VirtualSelectionMarkValue } from '@/constants';
import render from '@/render/render';
import applyVirtualMarksInRange from '@/utils/applyVirtualMarksInRange';

const apply = (vState: VirtualState): any => {
  const { vSel } = vState;

  if (!vSel.isInEditor || vSel.isCollapsed) return null;

  // Determine if virtual selection already italicized
  const isAllItalicized = vSel.marks.italics === VirtualSelectionMarkValue.ON;

  // Toggle italics mark on selected inlines
  applyVirtualMarksInRange(vState, { italics: !isAllItalicized });

  // Render updated virtual document
  render(vState);
};

export default apply;

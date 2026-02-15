import { VirtualSelectionMarkValue } from '@/constants';
import render from '@/render/render';
import applyVirtualMarksInRange from '@/utils/applyVirtualMarksInRange';

const apply = (vState: VirtualState): any => {
  const { vSel } = vState;

  if (!vSel.isInEditor || vSel.isCollapsed) return null;

  // Determine if virtual selection already has strikethrough
  const isAllStrikethrough =
    vSel.marks.strikethrough === VirtualSelectionMarkValue.ON;

  // Toggle strikethrough mark on selected inlines
  applyVirtualMarksInRange(vState, { strikethrough: !isAllStrikethrough });

  // Render updated virtual document
  render(vState);
};

export default apply;

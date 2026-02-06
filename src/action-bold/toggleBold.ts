import { VirtualSelectionMarkValue } from '@/constants';
import render from '@/render/render';
import applyVirtualMarksInRange from '@/utils/applyVirtualMarksInRange';

const toggleBold = (vState: VirtualState): any => {
  const { vSel } = vState;

  if (!vSel.isInEditor || vSel.isCollapsed) return null;

  // Determine if virtual selection already bolded
  const isAllBolded = vSel.marks.bold === VirtualSelectionMarkValue.ON;

  // Toogle bold mark on selected inlines
  applyVirtualMarksInRange(vState, { bold: !isAllBolded });

  // Render updated virtual document
  render(vState);
};

export default toggleBold;

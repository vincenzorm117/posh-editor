import applyVirtualMarksInRange from '@/utils/applyVirtualMarksInRange';
import getVirtuallySelectedBlocksAndInlines from '@/utils/getVirtuallySelectedBlocksAndInlines';

const toggleBold = (vState: VirtualState) => {
  const { vSel } = vState;

  if (!vSel.isInEditor || vSel.isCollapsed) return null;

  // Get virtually selected blocks and inlines
  const { inlines } = getVirtuallySelectedBlocksAndInlines(vState);

  // Determine if virtual selection already bolded
  const isBolded = inlines.every((inline) => !!inline.marks.bold);

  // Toogle bold mark on selected inlines
  applyVirtualMarksInRange(vState, { bold: !isBolded });
};

export default toggleBold;

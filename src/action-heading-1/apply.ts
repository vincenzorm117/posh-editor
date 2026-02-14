import render from '@/render/render';
import getVirtuallySelectedBlocksAndInlines from '@/utils/getVirtuallySelectedBlocksAndInlines';

const apply = (vState: VirtualState): any => {
  const { vSel } = vState;

  if (!vSel.isInEditor) return null;

  // Get blocks in selection
  const { blocks } = getVirtuallySelectedBlocksAndInlines(vState);

  // Check if in heading 1
  const isInHeading1 = blocks.every((block) => block.tag === 'H1');

  // Determine tag
  const tag = isInHeading1 ? 'P' : 'H1';

  // Apply heading mark to each block
  for (const block of blocks) {
    block.tag = tag;
  }

  // Render updated virtual document
  render(vState);
};

export default apply;

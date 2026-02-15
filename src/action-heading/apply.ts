import render from '@/render/render';
import getVirtuallySelectedBlocksAndInlines from '@/utils/getVirtuallySelectedBlocksAndInlines';

const apply = (
  vState: VirtualState,
  tag: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6',
): any => {
  const { vSel } = vState;

  if (!vSel.isInEditor) return null;

  // Get blocks in selection
  const { blocks } = getVirtuallySelectedBlocksAndInlines(vState);

  // Check if selection is already entirely within the specified heading tag
  const isHeading =
    vSel.blockTypes[tag] === true && Object.keys(vSel.blockTypes).length === 1;

  // Determine tag
  const newTag = isHeading ? 'P' : tag;

  // Apply heading mark to each block
  for (const block of blocks) {
    block.tag = newTag;
  }

  // Render updated virtual document
  render(vState);
};

export default apply;

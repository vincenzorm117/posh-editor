import getVirtuallySelectedBlocksAndInlines from '@/utils/getVirtuallySelectedBlocksAndInlines';

const getVirtualBlockTypes = (
  vSel: { start: number; end: number; isCollapsed: boolean },
  vDoc: VirtualDocument,
  vIndex: VirtualDocumentIndex,
  actions: Record<string, VirtualAction>,
): VirtualSelectionBlockTypes => {
  // Get blocks in selection
  const { blocks } = getVirtuallySelectedBlocksAndInlines({
    vDoc,
    vIndex,
    vSel,
  } as VirtualState);

  // Initialize block types with empty object
  const blockTypes = {} as VirtualSelectionBlockTypes;

  // Set block type to true for each block tag in selection
  for (const block of blocks) {
    blockTypes[block.tag] = true;
  }

  return blockTypes;
};

export default getVirtualBlockTypes;

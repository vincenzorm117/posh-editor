import zip from '@/helpers/ zip';
import unzip from '@/helpers/unzip';

const getVirtuallySelectedBlocksAndInlines = (
  vState: VirtualState,
): {
  blocks: VirtualBlock[];
  inlines: VirtualInline[];
  blockIndeces: VirtualBlockIndex[];
  inlineIndeces: VirtualInlineIndex[];
} => {
  const { vDoc, vIndex, vSel } = vState;

  // If not in editor, return empty arrays
  if (!vSel.isInEditor) {
    return { blocks: [], inlines: [], blockIndeces: [], inlineIndeces: [] };
  }

  // Get selection range
  const { start, end } = vSel;

  const blocksAndIndeces = zip(vDoc.blocks, vIndex.blocks);

  // Get virtually selected blocks and their indeces
  const bbs = blocksAndIndeces.filter(
    ([_, { globalStart, length }]) =>
      globalStart <= end && start < globalStart + length,
  );

  // Get inlines from selected blocks and their indeces
  const iis = bbs
    .map(([block, bi]) => {
      return zip(block.inlines, bi.inlines).filter(
        ([_, { globalStart, length }]) =>
          globalStart <= end && start < globalStart + length,
      );
    })
    .flat();

  // Unzip blocks and inlines
  const [blocks, blockIndeces] = unzip(bbs);
  const [inlines, inlineIndeces] = unzip(iis);

  return {
    blocks,
    inlines,
    blockIndeces,
    inlineIndeces,
  };
};

export default getVirtuallySelectedBlocksAndInlines;

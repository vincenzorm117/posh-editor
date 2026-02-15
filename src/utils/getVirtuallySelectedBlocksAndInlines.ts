import unzip from '@/helpers/unzip';
import zip from '@/helpers/zip';

const getVirtuallySelectedBlocksAndInlines = (
  vState: VirtualState,
): {
  blocks: VirtualBlock[];
  inlines: VirtualInline[];
  blockIndices: VirtualBlockIndex[];
  inlineIndices: VirtualInlineIndex[];
} => {
  const { vDoc, vIndex, vSel } = vState;

  // If not in editor, return empty arrays
  if (!vSel.isInEditor) {
    return { blocks: [], inlines: [], blockIndices: [], inlineIndices: [] };
  }

  // Get selection range
  const { start, end } = vSel;
  const selStart = Math.min(start, end);
  const selEnd = Math.max(start, end);

  const blocksAndIndices = zip(vDoc.blocks, vIndex.blocks);

  // Get virtually selected blocks and their indices
  const bbs = blocksAndIndices.filter(
    ([_, B]) => B.start <= selEnd && selStart <= B.end,
  );

  // Get inlines from selected blocks and their indices
  const iis = bbs
    .map(([block, bi]) => {
      return zip(block.inlines, bi.inlines).filter(
        ([_, I]) => I.start <= selEnd && selStart <= I.end,
      );
    })
    .flat();

  // Unzip blocks and inlines
  const [blocks, blockIndices] = unzip(bbs);
  const [inlines, inlineIndices] = unzip(iis);

  return {
    blocks,
    inlines,
    blockIndices,
    inlineIndices,
  };
};

export default getVirtuallySelectedBlocksAndInlines;

import getBlockInlineIndecesAtPosition from './getBlockInlineIndecesAtPosition';
import getVirtualSelectionMarksFromInline from './getVirtualSelectionMarksFromInline';

const removeSelectionFromVirtualDoc = (vState: VirtualState) => {
  const { vDoc, vSel, vIndex } = vState;

  if (!vSel.isInEditor || vSel.isCollapsed) {
    return;
  }

  const selStart = Math.min(vSel.start, vSel.end);
  const selEnd = Math.max(vSel.start, vSel.end);

  const startItems = getBlockInlineIndecesAtPosition(vIndex, selStart);
  const endItems = getBlockInlineIndecesAtPosition(vIndex, selEnd);

  // [Overview]
  // [Step] Load all blocks before start selection block
  // [Step] Load all inlines in start selection block before start selection inline
  // [Step] Load text start selection inline first text part
  // [Step] Update virtual selection to be after the inserted text
  // [Step] Load text end selection inline last text part
  // [Step] Load new start selection inline and all inlines in end selection block after end selection inline
  // [Step] Load new start selection block and all blocks after end selection block

  const newBlocks = [] as VirtualBlock[];

  const startBlockIndex = startItems.blockIndex.blockIndex;
  const startInlineIndex = startItems.inlineIndex.inlineIndex;
  const startBlock = vDoc.blocks[startBlockIndex];
  const startInline = { ...startBlock.inlines[startInlineIndex] };

  const endBlockIndex = endItems.blockIndex.blockIndex;
  const endInlineIndex = endItems.inlineIndex.inlineIndex;
  const endBlock = vDoc.blocks[endBlockIndex];
  const endInline = { ...endBlock.inlines[endInlineIndex] };

  /////////////////////////////////////////////////////////////////////////////////
  // [Step] Load all blocks before start selection block
  newBlocks.push(...vDoc.blocks.slice(0, startBlockIndex));

  /////////////////////////////////////////////////////////////////////////////////
  // [Step] Load all inlines in start selection block before start selection inline
  const newStartBlockInlines = startBlock.inlines.slice(0, startInlineIndex);

  /////////////////////////////////////////////////////////////////////////////////
  // [Step] Load start selection inline first text part + new text
  const cutStart = Math.max(selStart - startItems.inlineIndex.start, 0);
  startInline.text = startInline.text.slice(0, cutStart);

  /////////////////////////////////////////////////////////////////////////////////
  // [Step] Update selection to be after the inserted text
  vSel.start = selStart;
  if (vSel.isCollapsed) vSel.start = Math.max(0, selStart - 1);
  vSel.end = vSel.start;
  vSel.isCollapsed = true;
  vSel.direction = 'none';
  vSel.marks = getVirtualSelectionMarksFromInline(startInline);

  /////////////////////////////////////////////////////////////////////////////////
  // [Step] Load end selection inline last text part
  const cutEnd = Math.min(
    selEnd - endItems.inlineIndex.start,
    endInline.text.length,
  );
  endInline.text = endInline.text.slice(cutEnd);

  /////////////////////////////////////////////////////////////////////////////////
  // [Step] Load new start selection inline and all inlines in end selection block after end selection inline
  newStartBlockInlines.push(startInline);
  newStartBlockInlines.push(endInline);
  newStartBlockInlines.push(...endBlock.inlines.slice(endInlineIndex + 1));

  /////////////////////////////////////////////////////////////////////////////////
  // [Step] Load new start selection block and all blocks after end selection block
  newBlocks.push({
    ...startBlock,
    inlines: newStartBlockInlines,
  });
  newBlocks.push(...vDoc.blocks.slice(endBlockIndex + 1));

  vDoc.blocks = newBlocks;
};

export default removeSelectionFromVirtualDoc;

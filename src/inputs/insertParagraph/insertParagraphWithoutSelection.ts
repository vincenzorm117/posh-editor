import generateId from '@/helpers/generateId';
import getBlockInlineIndecesAtPosition from '@/utils/getBlockInlineIndecesAtPosition';
import getVirtualSelectionMarksFromInline from '@/utils/getVirtualSelectionMarksFromInline';

const insertParagraphWithoutSelection = (vState: VirtualState) => {
  const { vDoc, vIndex, vSel } = vState;

  if (!vSel.isInEditor || !vSel.isCollapsed) {
    return;
  }

  // [Overview]
  // [Step] Create new blocks array with split block at cursor position
  // [Step] Get block and inline indeces at cursor position
  // [Step] Load all blocks leading up to cursor
  // [Step] Load all inlines selection block before the selection inline
  // [Step] Split selection inline at cursor and add this split inline to current block
  // [Step] Create new block and add 2nd half of split inline to it
  // [Step] Add all inlines after selection
  // [Step] Load all blocks after selection block
  // [Step] Update virtual document
  // [Step] Update virtual selection to be at start of new line

  // [Step] Create new blocks array with split block at cursor position
  const newBlocks = [];
  const inlinesBeforeSplit = [];
  const inlinesAfterSplit = [];

  // [Step] Get block and inline indeces at cursor position
  const cursor = vSel.start;
  const { blockIndex, inlineIndex } = getBlockInlineIndecesAtPosition(
    vIndex,
    cursor,
  );
  const block = vDoc.blocks[blockIndex.blockIndex];
  const inline = block.inlines[inlineIndex.inlineIndex];

  // [Step] Load all blocks leading up to cursor
  for (let i = 0; i < blockIndex.blockIndex; i++) {
    newBlocks.push(vDoc.blocks[i]);
  }

  // [Step] Load all inlines selection block before the selection inline
  for (let i = 0; i < inlineIndex.inlineIndex; i++) {
    inlinesBeforeSplit.push(block.inlines[i]);
  }

  // [Step] Split selection inline at cursor and add this split inline to current block
  inlinesBeforeSplit.push({
    ...inline,
    text: inline.text.slice(0, cursor - inlineIndex.start),
  });
  newBlocks.push({
    ...block,
    inlines: inlinesBeforeSplit,
  });

  // [Step] Create new block and add 2nd half of split inline to it
  inlinesAfterSplit.push({
    ...inline,
    text: inline.text.slice(cursor - inlineIndex.start),
  });

  // [Step] Add all inlines after selection
  for (let i = inlineIndex.inlineIndex + 1; i < block.inlines.length; i++) {
    inlinesAfterSplit.push(block.inlines[i]);
  }

  newBlocks.push({
    ...block,
    id: generateId(),
    inlines: inlinesAfterSplit,
  });

  // [Step] Load all blocks after selection block
  for (let i = blockIndex.blockIndex + 1; i < vDoc.blocks.length; i++) {
    newBlocks.push(vDoc.blocks[i]);
  }

  // [Step] Update virtual document
  vDoc.blocks = newBlocks;

  // [Step] Update virtual selection to be at start of new line
  vSel.start = cursor + 1;
  vSel.end = vSel.start;
  vSel.isCollapsed = true;
  vSel.direction = 'none';
  vSel.marks = getVirtualSelectionMarksFromInline(inline);
};

export default insertParagraphWithoutSelection;

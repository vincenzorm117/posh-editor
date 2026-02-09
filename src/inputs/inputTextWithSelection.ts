import getBlockInlineIndecesAtPosition from '@/utils/getBlockInlineIndecesAtPosition';
import getVirtualSelectionMarksFromInline from '@/utils/getVirtualSelectionMarksFromInline';

const inputTextWithSelection = (
  vDoc: VirtualDocument,
  vSel: VirtualSelectionInEditor,
  vIndex: VirtualDocumentIndex,
  text: string,
) => {
  const selStart = Math.min(vSel.start, vSel.end);
  const selEnd = Math.max(vSel.start, vSel.end);

  const startItems = getBlockInlineIndecesAtPosition(vIndex, selStart);
  const endItems = getBlockInlineIndecesAtPosition(vIndex, selEnd);

  // 1. Load all blocks before start selection block
  // 2. Load all inlines in start selection block before start selection inline
  // 3. Load text start selection inline first text part
  // 4. Load text new text appended after start selection inline text
  // 5. Update virtual selection to be after the inserted text
  // 6. Load text end selection inline last text part
  // 7. Load new start selection inline and all inlines in end selection block after end selection inline
  // 8. Load new start selection block and all blocks after end selection block

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
  // 1. Load all blocks before start selection block
  newBlocks.push(...vDoc.blocks.slice(0, startBlockIndex));

  /////////////////////////////////////////////////////////////////////////////////
  // 2. Load all inlines in start selection block before start selection inline
  const newStartBlockInlines = startBlock.inlines.slice(0, startInlineIndex);

  /////////////////////////////////////////////////////////////////////////////////
  // 3. Load start selection inline first text part + new text
  const cutStart = Math.max(selStart - startItems.inlineIndex.start, 0);
  startInline.text = startInline.text.slice(0, cutStart);

  /////////////////////////////////////////////////////////////////////////////////
  // 4. Load new text appended after start selection inline text
  startInline.text += text;

  /////////////////////////////////////////////////////////////////////////////////
  // 5. Update selection to be after the inserted text
  vSel.start = selStart + text.length;
  vSel.end = vSel.start;
  vSel.isCollapsed = true;
  vSel.direction = 'none';
  vSel.marks = getVirtualSelectionMarksFromInline(startInline);

  /////////////////////////////////////////////////////////////////////////////////
  // 6. Load end selection inline last text part
  const cutEnd = Math.min(
    selEnd - endItems.inlineIndex.start,
    endInline.text.length,
  );
  endInline.text = endInline.text.slice(cutEnd);

  /////////////////////////////////////////////////////////////////////////////////
  // 7. Load new start selection inline and all inlines in end selection block after end selection inline
  newStartBlockInlines.push(startInline);
  newStartBlockInlines.push(endInline);
  newStartBlockInlines.push(...endBlock.inlines.slice(endInlineIndex + 1));

  /////////////////////////////////////////////////////////////////////////////////
  // 8. Load new start selection block and all blocks after end selection block
  newBlocks.push({
    ...startBlock,
    inlines: newStartBlockInlines,
  });
  newBlocks.push(...vDoc.blocks.slice(endBlockIndex + 1));

  vDoc.blocks = newBlocks;
};

export default inputTextWithSelection;

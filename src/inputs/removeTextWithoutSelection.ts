import getBlockInlineIndecesAtPosition from '@/utils/getBlockInlineIndecesAtPosition';
import getVirtualSelectionMarksFromInline from '@/utils/getVirtualSelectionMarksFromInline';

const removeTextWithoutSelection = (
  vDoc: VirtualDocument,
  vSel: VirtualSelectionInEditor,
  vIndex: VirtualDocumentIndex,
) => {
  const cursor = vSel.start;

  if (cursor === 0) {
    // Cursor is at the beginning of the document, nothing to remove
    return;
  }

  const { blockIndex, inlineIndex } = getBlockInlineIndecesAtPosition(
    vIndex,
    cursor,
  );
  const block = vDoc.blocks[blockIndex.blockIndex];
  const inline = block.inlines[inlineIndex.inlineIndex];

  const blockCursor = Math.max(cursor - blockIndex.start, 0);
  const inlineCursor = Math.max(cursor - inlineIndex.start, 0);

  // CASE: Removing text without deleting inline
  if (0 < inlineCursor) {
    inline.text =
      inline.text.slice(0, inlineCursor - 1) + inline.text.slice(inlineCursor);

    vSel.start = cursor - 1;
    vSel.end = vSel.start;
    vSel.isCollapsed = true;
    vSel.direction = 'none';
    vSel.marks = getVirtualSelectionMarksFromInline(inline);
    return;
  }

  // CASE: Deleting at the beginning of the block
  if (blockCursor === 0) {
    // Combine curr block with previous block
    const prevBlock = vDoc.blocks[blockIndex.blockIndex - 1];
    prevBlock.inlines.push(...block.inlines);
    // Remove current block
    vDoc.blocks.splice(blockIndex.blockIndex, 1);
    // Move selection back one position to end of previous block
    vSel.start = cursor - 1;
    vSel.end = vSel.start;
    vSel.isCollapsed = true;
    vSel.direction = 'none';
    vSel.marks = getVirtualSelectionMarksFromInline(inline);
    return;
  }

  // CASE: Deleting at the beginning of the inline but not the block
  if (inlineCursor === 0) {
    // Remove inline at inlineIndex
    block.inlines.splice(inlineIndex.inlineIndex, 1);
    // Move selection back one position to end of previous inline
    vSel.start = cursor - 1;
    vSel.end = vSel.start;
    vSel.isCollapsed = true;
    vSel.direction = 'none';
    const prevInline = block.inlines[inlineIndex.inlineIndex - 1];
    vSel.marks = getVirtualSelectionMarksFromInline(prevInline);
    return;
  }
};

export default removeTextWithoutSelection;

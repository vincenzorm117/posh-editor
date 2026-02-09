import isNonEmptyString from '@/helpers/isNonEmptyString';
import getBlockInlineIndecesAtPosition from '@/utils/getBlockInlineIndecesAtPosition';
import removeSelectionFromVirtualDoc from '@/utils/removeSelectionFromVirtualDoc';

const inputText = (vState: VirtualState, text: string | null) => {
  const { vDoc, vSel, vIndex } = vState;

  if (!vSel.isInEditor) {
    return;
  }

  if (!isNonEmptyString(text)) {
    return;
  }

  // If there is a selection, remove it before inserting the new text
  if (!vSel.isCollapsed) {
    removeSelectionFromVirtualDoc(vState);
  }

  // Get the inline at the current selection position
  const { inlineIndex } = getBlockInlineIndecesAtPosition(vIndex, vSel.start);
  const inline =
    vDoc.blocks[inlineIndex.blockIndex].inlines[inlineIndex.inlineIndex];

  // Insert text at the correct position in the inline's text content
  const offset = vSel.start - inlineIndex.start;
  inline.text = inline.text.slice(0, offset) + text + inline.text.slice(offset);

  // Update selection to be after the inserted text
  vSel.start += text.length;
  vSel.end = vSel.start;
};

export default inputText;

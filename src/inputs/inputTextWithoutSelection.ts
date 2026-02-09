import getBlockInlineIndecesAtPosition from '@/utils/getBlockInlineIndecesAtPosition';

// TODO: delete this file use what is in inputText.ts
const inputTextWithoutSelection = (vState: VirtualState, text: string) => {
  const { vDoc, vSel, vIndex } = vState;
  if (!vSel.isInEditor) {
    return;
  }
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

export default inputTextWithoutSelection;

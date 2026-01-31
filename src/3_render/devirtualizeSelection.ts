import { CHAR_ZERO_WIDTH_SPACE } from '../constants';
import { clamp } from '../helpers/clamp';

const virtualPositionToBlockOffset = (
  index: VirtualIndex,
  position: number,
) => {
  // Clamp position to valid range
  const p = clamp(position, 0, index.globalLength);

  // Find block containing position
  for (const b of index.blocks) {
    if (p <= b.globalPosition + b.length) {
      return {
        blockIndex: b.blockIndex,
        inBlockOffset: p - b.globalPosition,
      };
    }
  }

  // Fallback end of last block
  const lastBlock = index.blocks[index.blocks.length - 1];
  return {
    blockIndex: lastBlock.blockIndex,
    inBlockOffset: lastBlock.length,
  };
};

const virtualBlockOffsetToInline = (
  vDoc: VirtualDocument,
  blockIndex: number,
  inBlockOffset: number,
) => {
  const block = vDoc.blocks[blockIndex];
  const inlines = block?.children ?? [];

  let blockPosition = 0;
  for (const inline of inlines) {
    if (inBlockOffset <= blockPosition + inline.text.length) {
      return {
        inline,
        inInlineOffset: inBlockOffset - blockPosition,
      };
    }

    blockPosition += inline.text.length;
  }

  // Fallback of last inline
  const lastInline = inlines[inlines.length - 1];
  return {
    inline: lastInline,
    inInlineOffset: lastInline.text.length,
  };
};

const devirtualizePosition = (
  state: State,
  position: number,
): DomPoint | null => {
  const { blockIndex, inBlockOffset } = virtualPositionToBlockOffset(
    state.virtualIndex!,
    position,
  );

  const { inline, inInlineOffset } = virtualBlockOffsetToInline(
    state.virtualDocument!,
    blockIndex,
    inBlockOffset,
  );

  const esc = CSS?.escape
    ? CSS.escape(inline.id)
    : inline.id.replace(/"/g, '\\"');
  const inlineElement = state.editor.element.querySelector(
    `[data-id="${esc}"]`,
  );
  if (!inlineElement) {
    console.error('Inline element not found for id: ' + inline.id);
    return null;
  }

  // If not text node return null
  const textNode = inlineElement.firstChild;
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
    console.error('Inline element does not contain text node: ' + inline.id);
    return null;
  }

  //
  const rawText = textNode.nodeValue ?? '';
  const maxOffset = rawText == CHAR_ZERO_WIDTH_SPACE ? 0 : rawText.length;
  const offset = clamp(inInlineOffset, 0, maxOffset);

  return {
    node: textNode,
    offset,
  };
};

const devirtualizeSelection = (state: State) => {
  const { virtualSelection } = state;

  // Get selection object
  const selection = window.getSelection();
  if (!selection || !virtualSelection) return;

  // Convert virtual positions to DOM positions
  const anchorPos = devirtualizePosition(state, virtualSelection.anchor!);
  const focusPos = devirtualizePosition(state, virtualSelection.focus!);

  // If positions are invalid, do nothing
  if (!anchorPos || !focusPos) return;

  // Update selection by clearing existing ranges and adding new range
  selection.removeAllRanges();
  selection.setBaseAndExtent(
    anchorPos.node,
    anchorPos.offset,
    focusPos.node,
    focusPos.offset,
  );
};

export default devirtualizeSelection;

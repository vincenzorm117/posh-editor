import { clamp } from '../helpers/clamp';
import getOrderedSelection from '../utils/getOrderedSelection';
import debugRenderVirtualInline from './debugRenderVirtualInline';

const getUnderscoreLine = (
  block: VirtualBlock,
  blockIndex: VirtualBlockIndex,
  startPosition: number,
  endPosition: number,
) => {
  const { globalPosition } = blockIndex;

  if (globalPosition + blockIndex.length < startPosition) {
    return undefined;
  }

  if (endPosition < globalPosition) {
    return undefined;
  }

  return block.children.map((inline, j) => {
    const { globalPosition } = blockIndex.inlines[j];
    const inlineLength = inline.text.length;

    if (globalPosition + inlineLength < startPosition) {
      return '&nbsp;'.repeat(inlineLength);
    }

    if (endPosition < globalPosition) {
      return '';
    }

    const cutStart = clamp(startPosition - globalPosition, 0, inlineLength);
    const cutEnd = clamp(endPosition - globalPosition, 0, inlineLength);

    let underscoreLine = '';

    if (startPosition == endPosition) {
      if (cutEnd === inlineLength) {
        return '&nbsp;'.repeat(cutStart);
      } else {
        return '&nbsp;'.repeat(cutStart) + '^';
      }
    } else {
      if (0 < cutStart) {
        underscoreLine += '&nbsp;'.repeat(cutStart);
      }

      if (cutEnd > cutStart) {
        underscoreLine += '^'.repeat(cutEnd - cutStart);
      }
    }

    return underscoreLine;
  });
};

const debugRenderVirtualDocument = (state: State) => {
  try {
    const { virtualDocument, virtualSelection, virtualIndex } = state;

    const textBlocks = virtualDocument.blocks.map((block) =>
      block.children.map(debugRenderVirtualInline).join(''),
    );

    if (
      !virtualIndex ||
      !virtualSelection ||
      !virtualSelection.isInsideEditor
    ) {
      return textBlocks
        .map((tb) => `<p class="whitespace-pre">${tb}</p>`)
        .join('');
    }

    const { startPosition, endPosition } =
      getOrderedSelection(virtualSelection);

    const underscoreLines = virtualDocument.blocks.map((block, i) => {
      return getUnderscoreLine(
        block,
        virtualIndex.blocks[i],
        startPosition,
        endPosition,
      );
    });

    let finalDebugRender = '';
    for (let i = 0; i < textBlocks.length; i++) {
      finalDebugRender += `<p class="whitespace-pre">${textBlocks[i]}</p>`;
      if (underscoreLines[i]) {
        finalDebugRender += `<p>${underscoreLines[i]?.join('')}</p>`;
      }
    }

    return finalDebugRender;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
};

export default debugRenderVirtualDocument;

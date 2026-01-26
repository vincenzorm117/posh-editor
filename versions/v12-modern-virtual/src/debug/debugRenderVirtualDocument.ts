import { clamp } from '../helpers/clamp';
import getOrderedSelection from '../utils/getOrderedSelection';
import debugRenderVirtualInline from './debugRenderVirtualInline';

const getUnderscoreLine = (
  block: VirtualBlock,
  blockIndex: VirtualBlockIndex,
  startPosition: number,
  endPosition: number,
) => {
  if (blockIndex.globalPosition! + blockIndex.length < startPosition) {
    return undefined;
  }

  if (blockIndex.globalPosition! > endPosition) {
    return undefined;
  }

  return block.children.map((inline, j) => {
    const index = blockIndex.inlines[j];
    if (index.globalPosition + inline.text.length < startPosition) {
      return '';
    }

    if (index.globalPosition > endPosition) {
      return '';
    }

    const cutStart = clamp(
      startPosition - index.globalPosition,
      0,
      inline.text.length,
    );
    const cutEnd = clamp(
      endPosition - index.globalPosition,
      0,
      inline.text.length,
    );

    let underscoreLine = '';

    if (startPosition == endPosition) {
      return '&nbsp;'.repeat(cutStart) + '^';
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

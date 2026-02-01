import uid from '../helpers/uid';
import { clamp } from '../helpers/clamp';
import vCreateInline from '../1_virtualize/vCreateInline';
import vInlinesHaveSameMarks from './vInlinesHaveSameMarks';
import getOrderedSelection from '../utils/getOrderedSelection';
import virtualBuildIndex from './virtualBuildIndex';
import { virtualizeSelection } from '../1_virtualize/virtualizeSelection';
import normalizeMarks from '../utils/normalizeMarks';

const virtualApplyMarksInline = (
  virtualInlines: VirtualInline[],
  inlinesIndex: VirtualInlineIndex[],
  startPosition: number,
  endPosition: number,
  marksToApply: Record<string, boolean>,
): VirtualInline[] => {
  const newInlines = [] as VirtualInline[];

  for (let i = 0; i < virtualInlines.length; i++) {
    const inline = virtualInlines[i];
    const { globalPosition, length } = inlinesIndex[i];
    const inlineLength = inline.text.length;

    if (globalPosition + length < startPosition) {
      newInlines.push(inline);
      continue;
    }

    if (endPosition < globalPosition) {
      newInlines.push(inline);
      continue;
    }

    const cutStart = clamp(startPosition - globalPosition, 0, inlineLength);
    const cutEnd = clamp(endPosition - globalPosition, 0, inlineLength);

    if (cutEnd < cutStart) {
      throw new Error(`Unexpected cutEnd < cutStart: ${cutEnd} < ${cutStart}`);
    }

    if (cutStart > 0) {
      newInlines.push({
        ...inline,
        id: uid(),
        text: inline.text.slice(0, cutStart),
      });
    }

    newInlines.push({
      ...inline,
      id: uid(),
      text: inline.text.slice(cutStart, cutEnd),
      marks: {
        ...inline.marks,
        ...marksToApply,
      },
    });

    if (cutEnd < inlineLength) {
      newInlines.push({
        ...inline,
        id: uid(),
        text: inline.text.slice(cutEnd),
      });
    }
  }

  for (const newInline of newInlines) {
    newInline.marks = normalizeMarks(newInline.marks);
  }

  // Merge adjacent inlines with same marks
  const mergedInlines = [] as VirtualInline[];
  for (let i = 0; i < newInlines.length; i++) {
    const inline = newInlines[i];
    // TODO: consider adding this back in
    // if (inline.text == '') continue;
    const topMergedInline = mergedInlines[mergedInlines.length - 1];
    if (topMergedInline && vInlinesHaveSameMarks(topMergedInline, inline)) {
      topMergedInline.text += inline.text;
    } else {
      mergedInlines.push(inline);
    }
  }

  return mergedInlines;
};

const virtualApplyMarksInRange = (
  state: State,
  marksToApply: Record<string, boolean>,
) => {
  const { virtualSelection, virtualDocument, virtualIndex } = state;
  if (
    !virtualSelection ||
    !virtualDocument ||
    !virtualSelection.isInsideEditor
  ) {
    return;
  }

  const { startPosition, endPosition } = getOrderedSelection(virtualSelection!);

  let newBlocks = [] as VirtualBlock[];
  const virtualBlocks = virtualDocument.blocks ?? [];

  for (let i = 0; i < virtualBlocks.length; i++) {
    const block = virtualBlocks[i];
    const { length, globalPosition, inlines } = virtualIndex?.blocks[i]!;

    if (globalPosition + length < startPosition) {
      newBlocks.push(block);
      continue;
    }

    if (endPosition < globalPosition) {
      newBlocks.push(block);
      continue;
    }

    newBlocks.push({
      ...block,
      children: virtualApplyMarksInline(
        block.children,
        inlines,
        startPosition,
        endPosition,
        marksToApply,
      ),
    });
  }

  state.virtualDocument = {
    type: 'document',
    blocks: newBlocks,
  };

  state.virtualIndex = virtualBuildIndex(state);
  state.virtualSelection = virtualizeSelection(state);
};

export default virtualApplyMarksInRange;

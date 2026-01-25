import uid from '../uid';
import { clamp } from '../helpers/clamp';
import vCreateInline from '../vCreateInline';
import vInlinesHaveSameMarks from '../vInlinesHaveSameMarks';
import getOrderedSelection from '../utils/getOrderedSelection';

const virtualApplyMarksInline = (
  virtualInlines: VirtualInline[],
  globalPosition: number,
  startPosition: number,
  endPosition: number,
  marksToApply: Record<string, boolean>,
): VirtualInline[] => {
  const newInlines = [] as VirtualInline[];

  for (let i = 0; i < virtualInlines.length; i++) {
    const inline = virtualInlines[i];
    const inlineLength = inline.text.length;
    const globalInlineStart = globalPosition;
    const globalInlineEnd = globalPosition + inlineLength;

    if (globalInlineEnd < startPosition) {
      globalPosition += inlineLength;
      newInlines.push(inline);
      continue;
    }

    if (endPosition < globalInlineStart) {
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

  // Merge adjacent inlines with same marks
  const mergedInlines = [] as VirtualInline[];
  for (let i = 0; i < newInlines.length; i++) {
    const inline = newInlines[i];
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
  const { virtualSelection } = state;
  const { startPosition, endPosition } = getOrderedSelection(virtualSelection!);

  let newBlocks = [] as VirtualBlock[];
  const virtualBlocks = state.virtualDocument?.blocks ?? [];
  let globalPosition = 0;

  for (let bi = 0; bi < virtualBlocks.length; bi++) {
    const block = virtualBlocks[bi];
    const blockLength = block.children.reduce(
      (sum, inline) => sum + inline.text.length,
      0,
    );

    if (globalPosition + blockLength < startPosition) {
      globalPosition += blockLength + 1;
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
        globalPosition,
        startPosition,
        endPosition,
        marksToApply,
      ),
    });

    globalPosition += blockLength + 1;
  }

  return {
    ...state,
    virtualDocument: {
      ...state.virtualDocument,
      blocks: newBlocks,
    },
  } as State;
};

export default virtualApplyMarksInRange;

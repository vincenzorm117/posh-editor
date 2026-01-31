import getOrderedSelection from '../utils/getOrderedSelection';

const getIntersectingBlocks = (
  virtualBlocks: VirtualBlock[],
  virtualIndex: VirtualIndex,
  startPosition: number,
  endPosition: number,
) => {
  return virtualBlocks.filter((block, i) => {
    const { globalPosition, length } = virtualIndex.blocks[i];
    const blockStart = globalPosition;
    const blockEnd = blockStart + length;

    return startPosition < blockEnd && blockStart < endPosition;
  });
};

const getIntersectingInlines = (
  virtualInlines: VirtualInline[],
  virtualIndex: VirtualIndex,
  startPosition: number,
  endPosition: number,
) => {
  return virtualInlines.filter((_, i) => {
    const inline = virtualInlines[i];
    const { globalPosition, length } = virtualIndex.inlineById.get(inline.id)!;
    const inlineStart = globalPosition;
    const inlineEnd = inlineStart + length;

    return startPosition < inlineEnd && inlineStart < endPosition;
  });
};

const getVirtualSelectionMarks = (state: State): Record<string, any> => {
  const { virtualSelection, virtualDocument, virtualIndex } = state;
  if (
    !virtualSelection ||
    !virtualDocument ||
    !virtualIndex ||
    !virtualSelection.isInsideEditor
  ) {
    return {};
  }

  const { startPosition, endPosition } = getOrderedSelection(virtualSelection);

  let virtualBlocks = virtualDocument?.blocks || [];

  const blocks = getIntersectingBlocks(
    virtualBlocks,
    virtualIndex,
    startPosition,
    endPosition,
  );

  if (blocks.length === 0) {
    return {};
  }

  const markTracker = {} as Record<string, number>;

  const inlines = blocks
    .map((block, i) => {
      const virtualInlines = blocks[i].children || [];

      if (i === 0 || i === blocks.length - 1) {
        return getIntersectingInlines(
          virtualInlines,
          virtualIndex,
          startPosition,
          endPosition,
        );
      }

      return virtualInlines;
    })
    .flat();

  for (const inline of inlines) {
    // TODO: change from hardcoded marks to dynamic from global state
    for (const mark of ['bold']) {
      // Mark as 2 if present, 1 if absent
      const markTrackerValue = !!inline?.marks?.[mark] ? 2 : 1;
      if (!markTracker[mark]) {
        markTracker[mark] = markTrackerValue;
      } else {
        markTracker[mark] = markTracker[mark] | markTrackerValue;
      }
    }
  }

  const virtualSelectionMarks: Record<string, 'true' | 'false' | 'mixed'> = {};

  // Determine final mark states
  for (const mark in markTracker) {
    // 2 = all present, 1 = all absent, 3 = mixed
    if (markTracker[mark] === 2) {
      virtualSelectionMarks[mark] = 'true';
    } else if (markTracker[mark] === 1) {
      virtualSelectionMarks[mark] = 'false';
    } else {
      virtualSelectionMarks[mark] = 'mixed';
    }
  }

  return virtualSelectionMarks;
};

export default getVirtualSelectionMarks;

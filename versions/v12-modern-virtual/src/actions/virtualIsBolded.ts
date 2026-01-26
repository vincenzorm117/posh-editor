import getOrderedSelection from '../utils/getOrderedSelection';

const virtualIsBolded = (state: State): boolean => {
  const { virtualSelection, virtualDocument, virtualIndex } = state;
  if (
    !virtualSelection ||
    !virtualDocument ||
    !virtualIndex ||
    !virtualSelection.isInsideEditor
  ) {
    return false;
  }

  const { startPosition, endPosition } = getOrderedSelection(virtualSelection);

  let virtualBlocks = virtualDocument?.blocks || [];
  for (let i = 0; i < virtualBlocks.length; i++) {
    const block = virtualBlocks[i];
    const { length, globalPosition, inlines } = virtualIndex?.blocks[i]!;

    // Selection starts after this block
    if (globalPosition + length < startPosition) {
      continue;
    }

    if (endPosition < globalPosition) {
      break;
    }

    for (let j = 0; j < block.children.length; j++) {
      const inline = block.children[j];
      const { globalPosition, length } = inlines[j]!;

      // Case: inline fully contains selection
      if (
        globalPosition <= startPosition &&
        endPosition <= globalPosition + length
      ) {
        return !!inline?.marks?.bold;
      }

      if (globalPosition + length <= startPosition) {
        continue;
      }

      if (endPosition < globalPosition) {
        break;
      }

      if (!inline?.marks?.bold) {
        return false;
      }
    }
  }

  return true;
};

export default virtualIsBolded;

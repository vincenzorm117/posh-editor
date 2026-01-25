import getOrderedSelection from '../utils/getOrderedSelection';

const virtualIsBolded = (state: State): boolean => {
  const { virtualSelection, virtualDocument } = state;
  if (!virtualSelection || virtualSelection.isCollapsed) {
    return false;
  }

  const { startPosition, endPosition } = getOrderedSelection(virtualSelection);

  let globalPosition = 0;
  let virtualBlocks = virtualDocument?.blocks || [];
  for (let bi = 0; bi < virtualBlocks.length; bi++) {
    const block = virtualBlocks[bi];
    const blockLength = block.children.reduce(
      (sum, inline) => sum + inline.text.length,
      0,
    );

    // Selection starts after this block
    if (globalPosition + blockLength < startPosition) {
      globalPosition += blockLength;
      continue;
    }

    if (endPosition < globalPosition) {
      // TODO: consider short-circuiting to true here since all prior inlines were bolded
      break;
    }

    for (let ii = 0; ii < block.children.length; ii++) {
      const inline = block.children[ii];
      const inlineLength = inline.text.length;

      if (globalPosition + inlineLength <= startPosition) {
        globalPosition += inlineLength;
        continue;
      }

      if (endPosition <= globalPosition) {
        // TODO: consider short-circuiting to true here since all prior inlines were bolded
        break;
      }

      if (!inline?.marks?.bold) {
        return false;
      }

      globalPosition += inlineLength;
    }
  }

  return true;
};

export default virtualIsBolded;
